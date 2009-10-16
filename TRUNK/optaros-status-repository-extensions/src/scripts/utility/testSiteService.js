var site = siteService.getSite("testsitejs");
//if (site == null) {
//	logger.log("Site is null");
//} else {
var folder = site.getContainer("optarosStatus");
logger.log("Folder name:" + folder.name);
	
logger.log("id:" + folder.id);
logger.log("ref:" + folder.nodeRef.toString());
//}

/*
site = siteService.createSite(null, "testsitejs", "testsitejs", "testsitejs", true);
site.createContainer("optarosStatus");

folder = site.getContainer("optarosStatus");
logger.log("Folder name:" + folder.name);

*/