var SITE_ID = "greenenergy";

site = siteService.createSite(null, SITE_ID, SITE_ID, SITE_ID, true);

site.setMembership("admin", "SiteManager");
site.setMembership("tuser7", "SiteCollaborator");
site.save();

