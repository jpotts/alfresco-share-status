/**
 * Copyright 2009 Optaros, Inc.
 */
var STORE = "workspace://SpacesStore";
var COMPONENT_ID = "optarosStatus";
var HISTORY_FOLDER_NAME = "History";
var DEFAULT_CONTENT_NAME = "status";
var ACTIVITY_TYPE = "com.optaros.status.status-set";

// model properties
var SITE_ID_PROP = "optStatus:siteId";
var COMPLETE_PROP = "optStatus:complete";
var PREFIX_PROP = "optStatus:prefix";
var MOOD_PROP = "optStatus:mood";
var USER_PROP = "optStatus:user";
var MESSAGE_PROP = "optStatus:message";

/**
 *	Returns one or more status entries for a given siteId, and, optionally, a userName.
 */
function getStatusList(siteId, userName) {
	return getStatusObjects(siteId, userName, false, false);		 
}

/**
 *	Returns one or more status history entries for a given siteId, and, optionally, a userName.
 */
function getStatusHistoryList(siteId, userName) {
	return getStatusObjects(siteId, userName, false, true);		 
}

/**
 *	Returns one or more status entries across all sites.
 */
function getGlobalStatusList() {
	return getStatusObjects(null, null, true, false);
}

/**
 *	Returns one or more status history entries across all sites.
 */
function getGlobalStatusHistoryList() {
	return getStatusObjects(null, null, true, true);
}

/**
 *	Gets a list of optStatus:status objects.
 *	
 *	@param siteId
 *	@param userName
 *	@param isHicontentNamestoryOnly
 *	@param isGlobal
 */
function getStatusObjects(siteId, userName, isGlobal, isHistoryOnly) {
	
	// build the query string
	
	// start with the base -- we always want to check for the type
	var query = "TYPE:\"optStatus:status\"";
	
	if (isGlobal) {
		if (isHistoryOnly) {
			// global history query
			query += " AND PATH:\"/app:company_home/st:sites/cm:*/cm:*/cm:" + HISTORY_FOLDER_NAME + "/*\"";
		} else {
			// global current query
			query += " AND PATH:\"/app:company_home/st:sites/cm:*/cm:*/*\"";
		}
	} else {
		// if this is not global, but you failed to provide the siteId, bail
		if (siteId == null || siteId.length == 0) {
			return null;
		}
		
		// add the siteId
		query += " AND @optStatus\\:siteId:" + siteId;
		
		// first check current versus history
		if (isHistoryOnly) {
			//site history query
			query += " AND PRIMARYPARENT :\"" + getStatusHistoryFolder(siteId).nodeRef.toString() + "\"";
		} else {
			//site current query
			query += " AND PRIMARYPARENT :\"" + getStatusFolder(siteId).nodeRef.toString() + "\"";
		}
		
		// then add the user if passed in		
		if (userName != null) {
			// history or current plus user
			query += " AND @optStatus\\:user:" + userName;
		} else {
			// history or current without user
			// noop
		}
	}
			
	logger.log("query:" + query);
	
	// sort with descending modification date
	var sortAttribute = "@{http://www.alfresco.org/model/content/1.0}modified";
	var ascending = false;
	
	return search.luceneSearch(STORE, query, sortAttribute, ascending);
}

/**
 *	Returns the site object for the specified siteId
 */
function getSite(siteId) {
	// if the site does not exist, bail
	var site = siteService.getSite(siteId);
	if (site == null) {
		logger.log("The site does not exist: " + siteId);
	}
	return site;
}

/**
 *	Returns the folder in which status objects are stored. Creates if it doesn't exist.
 */
function getStatusFolder(siteId) {
	var site = getSite(siteId);
	
	if (site == null) {
		return null;
	}
	
	// if the container folder doesn't exist, create it
	folder = site.getContainer(COMPONENT_ID);
	if (folder == null) {
		folder = site.createContainer(COMPONENT_ID);
	}
	
	return folder;
}

/**
 *	Returns the folder in which history objects are stored. Creates if it doesn't exist.
 */
function getStatusHistoryFolder(siteId) {
	
	var statusFolder = getStatusFolder(siteId);
	
	if (statusFolder == null) {
		return null;
	}
	
	var query = "PARENT:\"" + statusFolder.nodeRef.toString() + "\" AND TYPE:\"cm:folder\" AND @cm\\:name:" + HISTORY_FOLDER_NAME;
	var results = search.luceneSearch(STORE, query);
	
	if (results[0] == undefined) {
		historyFolder = statusFolder.createFolder(HISTORY_FOLDER_NAME);
	} else {
		historyFolder = results[0];
	}
	
	return historyFolder;
}

/**
 * Update a status object with the new message/mood 
 */
 function updateStatusObject(params) {
    var statusList = getStatusList(params.siteId, params.userName);
    var statusNode = statusList[0];
    
    if (statusNode == undefined) {
    	logger.log("No current status found, creating");
    	var timestamp = new Date().getTime();
 		var statusNode = getStatusFolder(params.siteId).createNode(DEFAULT_CONTENT_NAME + timestamp, "optStatus:status");
		statusNode.properties["cm:name"] = DEFAULT_CONTENT_NAME + " (" + timestamp + ")";    	
	} else {
		logger.log("Found current status, updating");
	}
	
	statusNode.properties[SITE_ID_PROP] = params.siteId;
	statusNode.properties[PREFIX_PROP] = params.prefix;
	statusNode.properties[MOOD_PROP] = params.mood;
	statusNode.properties[USER_PROP] = params.userName;
	statusNode.properties[COMPLETE_PROP] = params.isComplete;
	statusNode.properties[MESSAGE_PROP] = params.message;
	statusNode.content = params.prefix + " " + params.message;
	statusNode.save();
	
    if (params.isComplete == "true" ) {
    	logger.log("Moving to archive");
    	archiveStatusObject(statusNode);
    }
    
    // update activity service
    activities.postActivity(ACTIVITY_TYPE, params.siteId, COMPONENT_ID, getActivityData(params));
    
    
    return statusNode;
 }
 
 /**
  * Returns the activity JSON data.
  */
 function getActivityData(params) {
 	var obj = {};
  
 	obj.siteId = params.siteId;
 	obj.prefix = params.prefix;
 	obj.message = params.message;
 	obj.complete = params.isComplete;

	return jsonUtils.toJSONString(obj); 
 }
   
 function archiveStatusObject(statusNode) {
 	var historyFolderNode = getStatusHistoryFolder(statusNode.properties[SITE_ID_PROP]);
 	statusNode.move(historyFolderNode);
 }
 