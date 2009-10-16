<import resource="classpath:alfresco/extension/scripts/optarosStatus.js">

function getParams() {
	// Grab the URI parameters
	var siteId = url.templateArgs.siteId;
	var userName = url.templateArgs.user;

	return {
		"siteId": siteId,
		"userName": userName
	};
}

function main() {
	var params = getParams();

	var isHistoryOnly = false;
	var isGlobal = false;
	
	if (url.match.indexOf("history") > 0) {
		isHistoryOnly = true;
	}
	
	if (url.match.indexOf("global") > 0) {
		isGlobal = true;
	}

	if (isGlobal) {
		if (isHistoryOnly) {
			return getGlobalStatusHistoryList();
		} else {
			return getGlobalStatusList();
		}
	} else {
		if (isHistoryOnly) {
			return getStatusHistoryList(params.siteId, params.userName);
		} else {
			return getStatusList(params.siteId, params.userName);
		}
	}

}

var results = main();
model.results = results;