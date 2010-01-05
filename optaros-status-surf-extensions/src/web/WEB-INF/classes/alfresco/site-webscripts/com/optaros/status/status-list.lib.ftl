<#--
    Renders a status node as a JSON object
--> 
<#macro statusJSON status>
   <#escape x as jsonUtils.encodeJSONString(x)>
      {
         "siteId" : "${status.siteId!''}",
         "user" : "${status.user!''}",
         "message" : "${status.message!''}",
         "prefix" : "${status.prefix!''}",
         "mood" : "${status.mood!''}",
         "complete" : ${(status.complete!'false')?string},
         "created" : "${status.created}",
         "modified" : "${status.modified}"  
      }
   </#escape>
</#macro>

<#--
    Renders a status node as HTML
--> 
<#macro statusHTML status>
    SiteID: ${status.siteId!''}<br />
	User: ${status.user!''}<br />
	Message: ${status.message!''}<br />
	Prefix: ${status.prefix!''}<br />
	Mood: ${status.mood!''}<br />
	Complete: ${(status.complete!'false')?string}<br />
	Created: ${status.created}<br />
	Modified: ${status.modified}<br />
</#macro>
