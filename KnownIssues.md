# Known Issues #

## Activity Feeds prior to 3.2 ##

Running this component in 3.1 Enterprise may cause activity feeds to break. That's because the way activity feeds are configured changed between 3.1 and 3.2 and because 3.2 is the latest release in both Enterprise and Community, there doesn't seem to be a good reason to backport a fix.

However, if you are running 3.1 Enterprise, there are two files included in the Surf extensions zip that you should overwrite with versions from the original Share WAR file. They are:
  * WEB-INF/classes/alfresco/site-webscripts/org/alfresco/components/dashlets/activity-list.get.js
  * WEB-INF/classes/alfresco/site-webscripts/org/alfresco/components/dashlets/activity-list.get.properties

Once you've retrieved the original versions of these files, you can patch them to enable Status-related activity feeds. See [Issue #2](http://code.google.com/p/alfresco-share-status/issues/detail?id=2) for the diffs.

Although this gets activity feeds going for your site, it may not enable feeds for the global dashboard. I haven't looked into that. Again, if there a lot of people using this on 3.1 Enterprise with no plans to upgrade to 3.2 Enterprise, we can look into a more formal fix.