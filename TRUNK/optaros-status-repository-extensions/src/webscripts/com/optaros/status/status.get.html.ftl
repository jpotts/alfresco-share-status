<html>
<table>
	<#list results as result>
	<tr>
	<td>
    <@statusLib.statusHTML status=result />
	</td>
	</tr>  
	</#list>
</table>
</html>