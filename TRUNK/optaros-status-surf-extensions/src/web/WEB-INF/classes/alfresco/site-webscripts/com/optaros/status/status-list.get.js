/**
 * Copyright 2009 Optaros, Inc.
 */

function main()
{
   var global = args.global;
   var user = args.user;
   var site = args.site;
   var history = args.history;

   connector = remote.connect("alfresco");

   var url = "/status";
   if (history === 'true')
   {
      url += "/history";
   }
   if (global === 'true')
   {
      url += "/global";
   }

   if (site && site.length > 0)
   {
      url += "/site/" + site;
   }
   if (user && user.length > 0)
   {
      url += "/" + user;
   }
   
   var result = connector.get(url);
   model.result = result;
   if (result.status == 200)
   {
      // Create javascript objects from the server response
      var statusList = eval("(" + result + ")");
      model.items = statusList.items;
   }
}

main();
