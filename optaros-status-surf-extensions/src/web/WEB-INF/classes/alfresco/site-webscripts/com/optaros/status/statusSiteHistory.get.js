/**
 * Copyright 2009 Optaros, Inc.
 */

function main()
{
   // check whether we got a site
   var site = page.url.templateArgs.site;
   if (site == undefined)
   {
      // if we are in a surf site, but not share, we have to get
      // the site ID from the site config props
      site = sitedata.siteConfiguration.properties["site"];
   	  if (site == undefined) {
         model.error = true;
         model.message = "message.nositespecified"
         return;
      }
   }
   model.site = site;
}

main();