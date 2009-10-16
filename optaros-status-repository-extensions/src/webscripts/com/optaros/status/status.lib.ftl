<#--
 #
 # Copyright 2009 Optaros, Inc.
 #
 -->
 
<#assign datetimeformat="EEE, dd MMM yyyy HH:mm:ss zzz">

<#--
    Renders a status node as a JSON object
--> 
<#macro statusJSON status>
   <#escape x as jsonUtils.encodeJSONString(x)>
      {
         "siteId" : "${status.properties["optStatus:siteId"]!''}",
         "user" : "${status.properties["optStatus:user"]!''}",
         "message" : "${status.properties["optStatus:message"]!''}",
         "prefix" : "${status.properties["optStatus:prefix"]!''}",
         "mood" : "${status.properties["optStatus:mood"]!''}",
         "complete" : ${(status.properties["optStatus:complete"]!'false')?string},
         "created" : "${status.properties["cm:created"]?string(datetimeformat)}",
         "modified" : "${status.properties["cm:modified"]?string(datetimeformat)}"  
      }
   </#escape>
</#macro>

<#--
    Renders a status node as HTML
--> 
<#macro statusHTML status>
    SiteID: ${status.properties["optStatus:siteId"]!''}<br />
	User: ${status.properties["optStatus:user"]!''}<br />
	Message: ${status.properties["optStatus:message"]!''}<br />
	Prefix: ${status.properties["optStatus:prefix"]!''}<br />
	Mood: ${status.properties["optStatus:mood"]!''}<br />
	Complete: ${(status.properties["optStatus:complete"]!'false')?string}<br />
	Created: ${status.properties["cm:created"]?string(datetimeformat)}<br />
	Modified: ${status.properties["cm:modified"]?string(datetimeformat)}<br />
</#macro>
