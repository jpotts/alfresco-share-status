<#--
 #
 # Copyright 2009 Optaros, Inc.
 #
 -->
<#assign username=userId>
<#if firstName?exists>
   <#assign username = firstName + " " + lastName>
</#if>
<entry xmlns='http://www.w3.org/2005/Atom'>
   <title>${username?html?xml} changed status to ${(prefix!'')?html} ${(message!'')?html}</title>
   <link rel="alternate" type="text/html" href="#" />
   <id>${id}</id>
   <updated>${xmldate(date)}</updated>
   <summary type="html">
      <![CDATA[${username} changed status to ${(prefix!'')?html} ${(message!'')?html}]]>
   </summary>
   <author>
   <name>${userId!""}</name>
   </author> 
</entry>