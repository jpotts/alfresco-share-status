<script type="text/javascript">//<![CDATA[
   new Optaros.StatusList("${args.htmlid}").
      setOptions({
         "siteId": "",
         "global": true,
         "history": false,
         "user": ""
      }).setMessages(
		${messages}
		);
//]]></script>
<div class="dashlet">
   <div class="title">${msg("title.statuslist")}</div>
   <div class="statuslist-container">
      <div id="${args.htmlid}-statuslist" class="statuslist"></div>
   </div>
</div>