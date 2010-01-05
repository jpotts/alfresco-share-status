<#if (! error??)>
<script type="text/javascript">//<![CDATA[
   optaros = new Optaros.MyStatus("${args.htmlid}").
      setOptions({
         "siteId": "${site}"
      }).setMessages(
			${messages}
		);
//]]></script>
</#if>

<div class="dashlet">
	<div class="title">${msg("title.mystatus")}</div>
	<div class="body">
		<#if error??>
      		<div class="error-msg">${msg(message)}</div>
    	<#else>
			<div id="${args.htmlid}-statustext-div" class="statustext">
				<p>
	         		<button id="${args.htmlid}-prefix-button">
						${msg("label.mystatus.prefix")} 
						<#if prefix_value?exists && prefix_value != "">
	 						${msg("prefix." + prefix_value)}
						<#else>
							${msg("prefix." + prefixes[0])}
						</#if>
						${msg("label.mystatus.suffix")}</button>
	         		<select id="${args.htmlid}-prefix-menu">
	            			<#list prefixes as prefix>
								<option value="${prefix}" <#if prefix == prefix_value>SELECTED</#if>>${msg("label.mystatus.prefix")} ${msg("prefix." + prefix)}${msg("label.mystatus.suffix")}</option>
	            			</#list>
	         		</select>
	         		<button id="${args.htmlid}-mood-button">		                
						${msg("label.mymood.prefix")} 
						<#if mood_value?exists && mood_value != "">
							<img src="${page.url.context}${msg("filepath.mood."+mood_value)}" alt="${msg("tooltip.mood."+mood_value)}" />
						<#else>
							<img src="${page.url.context}${msg("filepath.mood.1")}" alt="${msg("tooltip.mood.1")}" />
						</#if>
						${msg("label.mymood.suffix")}</button>
				<div id="${args.htmlid}-mood-menu" class="yuimenu">
					<div class="bd">
						<ul class="first-of-type">						
						    <#list 0..msg("numberof.moods")?number-1 as mood>
							<li value="${mood}" class="yuimenuitem">
<a href="#" class="yuimenuitemlabel" title="${msg("tooltip.mood."+mood)}"> ${msg("label.mymood.prefix")} <img src="${page.url.context}${msg("filepath.mood."+mood)}" alt="${msg("tooltip.mood."+mood)}" border="0" class="moodicon"/> ${msg("label.mymood.suffix")}</a></li>
						    </#list>  
						</ul> 
					</div>
				</div>
				
				</p>
				<script>function getOrigMoodValue() {return "<#if mood_value?exists && mood_value != "">${mood_value}<#else>1</#if>";}</script>
				<p>
					<textarea id="${args.htmlid}-statustext" tabindex="101" onKeyUp="optaros.onStatusValueChange(this)">${status_value}</textarea>
				</p>
			
				<p>
					<span class="done rel_left"><input id="${args.htmlid}-done-checkbox" type="checkbox" tabindex="102"/>&nbsp;${msg("done")}&nbsp;</span>
					<button id="${args.htmlid}-update-button" tabindex="103" >${msg("action.update")}</button>
				</p>
			</div>
   		</#if>
	</div>
</div>
