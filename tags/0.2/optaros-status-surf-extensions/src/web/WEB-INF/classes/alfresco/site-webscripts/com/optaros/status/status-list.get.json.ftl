<#import "status-list.lib.ftl" as statusListLib/>

{
   "items" : [
		<#if items?? && items?size &gt; 0>
		   <#list items as item>
		      <@statusListLib.statusJSON status=item />
		      <#if item_has_next>,</#if>
		   </#list>
		</#if>
   ]
}