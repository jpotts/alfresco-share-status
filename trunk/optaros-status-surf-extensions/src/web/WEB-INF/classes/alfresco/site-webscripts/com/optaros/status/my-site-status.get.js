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
   
   // check the privileges of the user - if he's a consumer or even not in the site, he's not allowed
   // to post a status
   var json = remote.call("/api/sites/" + site + "/memberships/" + user.name);
   if (json.status != 200)
   {
      model.error = true;
      model.message= "message.notamember";
      return;
   }
   else
   {
      // check whether the user is more than a consumer
      var obj = eval('(' + json + ')');
      if ((! obj) || obj.role == 'SiteConsumer')
      {
         model.error = true;
         model.message = "message.onlyconsumer";
         return;
      }
   }
   
   // find the current status for the user
   var json = remote.call("/status/site/" + site + "/" + user.name);
   if (json.status == 200)
   {
      // Create javascript object from the repo response
      var obj = eval('(' + json + ')');
      if (obj)
      {
         // check whether we have at status object
         if (obj.items.length > 0)
         {
            model.current_status = obj.items[0];
            model.status_value = model.current_status.message; 
            model.prefix_value = model.current_status.prefix;
			model.mood_value=model.current_status.mood;
         }
         else
         {
            model.status_value = '';
            model.prefix_value = '';
			model.mood_value='';
         }
      }
   }

   // set the available prefixes - the strings need to be available as "prefix." + prefix, e.g. prefix.done=Done
   var prefixes = [
      "working",
      "starting",
      "finishing",
      "stuck",
      "thinking",
      "delegating"      
   ];
   model.prefixes = prefixes;
}
main();
