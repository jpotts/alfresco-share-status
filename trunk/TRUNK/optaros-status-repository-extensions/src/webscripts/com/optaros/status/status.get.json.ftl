<#import "status.lib.ftl" as statusLib/>
{
   "items" : [
   <#list results as result>
      <@statusLib.statusJSON status=result />
      <#if result_has_next>,</#if>
   </#list>
   ]
}