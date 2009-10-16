/**
 * Optaros StatusList component.
 * 
 * @namespace Optaros
 * @class Optaros.StatusList
 */

// Ensure Optaros root object exists
if (typeof Optaros == "undefined" || !Optaros)
{
   var Optaros = {};
}

(function()
{  
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Element = YAHOO.util.Element;
    
   /**
    * StatusList constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Optaros.StatusList} The new StatusList instance
    * @constructor
    */
   Optaros.StatusList = function(htmlId)
   {
      /* Mandatory properties */
      this.name = "Optaros.StatusList";
      this.id = htmlId;
      
      /* Initialise prototype properties */
      this.widgets = {};
      this.listWidgets = [];
      
      /* Register this component */
      Alfresco.util.ComponentManager.register(this);

      /* Load YUI Components */
      Alfresco.util.YUILoaderHelper.require(["button", "container", "datasource", "datatable", "json"], this.onComponentsLoaded, this);
         
      YAHOO.Bubbling.on("statusUpdated", this.onStatusUpdated, this);

      return this;
   };
   
   Optaros.StatusList.prototype =
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * siteId to StatusList in. "" if StatusList should be cross-site
          * 
          * @property siteId
          * @type string
          */
         siteId: "",
         global: false,
         user: "",
         history: false
      },

      /**
       * Object container for storing YUI widget instances.
       * 
       * @property widgets
       * @type object
       */
      widgets: null,
      
      /**
       * Object container for storing YUI widget instances used in the list cells
       */
      listWidgets: null,
      
      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       * @return {Optaros.StatusList} returns 'this' for method chaining
       */
      setOptions: function StatusList_setOptions(obj)
      {
         this.options = YAHOO.lang.merge(this.options, obj);
         return this;
      },
      
      /**
       * Set messages for this component.
       *
       * @method setMessages
       * @param obj {object} Object literal specifying a set of messages
       * @return {Optaros.StatusList} returns 'this' for method chaining
       */
      setMessages: function StatusList_setMessages(obj)
      {
         Alfresco.util.addMessages(obj, this.name);
         return this;
      },
      
      /**
       * Fired by YUILoaderHelper when required component script files have
       * been loaded into the browser.
       *
       * @method onComponentsLoaded
       */
      onComponentsLoaded: function StatusList_onComponentsLoaded()
      {
         Event.onContentReady(this.id, this.onReady, this, true);
      },

      /**
       * Catch status update events to refresh the list
       */ 
      onStatusUpdated: function StatusList_onStatusUpdated(layer, args)
      {
         this.populateStatusList();
      },


      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function StatusList_onReady()
      {   
         
         // DataSource definition  
         this.widgets.dataSource = new YAHOO.util.DataSource( Alfresco.constants.URL_SERVICECONTEXT + "status/list?" );
         this.widgets.dataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
         //this.widgets.dataSource.connXhrMode = "queueRequests";
         this.widgets.dataSource.responseSchema = { 
			resultsList: "items",
            fields: ['siteId', 'user', 'message', 'prefix', 'mood', 'created', 'modified', 'complete']
         };
         
         // setup of the datatable
         this._setupDataTable();
      },

      _setupDataTable: function StatusList_setupDataTable()
      {
         /**
          * DataTable Cell Renderers
          *
          * Each cell has a custom renderer defined as a custom function. See YUI documentation for details.
          * These MUST be inline in order to have access to the Optaros.StatusList class (via the "me" variable).
          */
         var me = this;

         /**
          * Message custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellMessage = function StatusList_renderCellMessage(elCell, oRecord, oColumn, oData)
         {
            // we currently render all results the same way
            var message = oRecord.getData("message");
			var prefix = oRecord.getData("prefix");
			var created = oRecord.getData("created");
			var modified = oRecord.getData("modified");
			var complete = oRecord.getData("complete");
            var desc = "";
            desc = '<span class="itemname">';
	 			//prefix
				if(complete) {
					desc += '<input type="checkbox" checked="checked" disabled="disabled"/> ';
					desc += me._msg("user.is_done_with");
				} else {
					desc += '<input type="checkbox" disabled="disabled"/> ';
					desc += me._msg("user.is") + ' ';
					desc += Alfresco.util.encodeHTML(me._msg("prefix."+prefix));					
				}
				//message
				desc += ' <span class="messagebody">'+Alfresco.util.encodeHTML(message)+'</span>';
 			desc += '</span>';
			//timestamps
            desc += '<div class="timestamps">';
				desc += '<hr size="1"/>'
            	desc += '<span>'+me._msg("created.label") + '</span> ' + Alfresco.util.encodeHTML(created) + '  ';
            	desc += '<span>'+me._msg("modified.label") + '</span> ' + Alfresco.util.encodeHTML(modified);
            desc += '</div>';
            elCell.innerHTML = desc;
         };

         /**
          * User custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellUser = function StatusList_renderCellUser(elCell, oRecord, oColumn, oData)
         {
            // we currently render all results the same way
            var name = oRecord.getData("user");
            var desc = "";
            desc = '<h3 class="username">';
				//user
				desc += Alfresco.util.encodeHTML(name);
 			desc += '</h3>';
            elCell.innerHTML = desc;
         };

         /**
          * Site custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellSite = function StatusList_renderCellSite(elCell, oRecord, oColumn, oData)
         {
            // we currently render all results the same way
            var site = oRecord.getData("siteId");
            var desc = "";
            desc = '<h3 class="site">';
				//site
				desc += Alfresco.util.encodeHTML(site);
 			desc += '</h3>';
            elCell.innerHTML = desc;
         };

         /**
          * Mood custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellMood = function StatusList_renderCellMood(elCell, oRecord, oColumn, oData)
         {
            // we currently render all results the same way
            var mood = oRecord.getData("mood");
            var desc = "";
				//mood
	            desc += '<div class="mood">';
					desc += '<img src="'+Alfresco.constants.URL_CONTEXT+'' + me._msg("filepath.mood."+mood) + '" alt="' + me._msg("tooltip.mood."+mood) + '" /> ';
	            desc += '</div>';
            elCell.innerHTML = desc;
         };

         // DataTable column defintions
         var columnDefinitionsSite = [
         {
			key: "user", label: this._msg("statuslist.table.header.user"), sortable:true, formatter: renderCellUser
		 },
		 {
            key: "message", label: this._msg("statuslist.table.header.message"), sortable: false, formatter: renderCellMessage
         },
		 {
            key: "mood", label: this._msg("statuslist.table.header.mood"), sortable: true, formatter: renderCellMood
         }
			];
			
         var columnDefinitionsGlobal = [
         {
			key: "site", label: this._msg("statuslist.table.header.site"), sortable:true, formatter: renderCellSite
		 },
         {
			key: "user", label: this._msg("statuslist.table.header.user"), sortable:true, formatter: renderCellUser
		 },
		 {
            key: "message", label: this._msg("statuslist.table.header.message"), sortable: false, formatter: renderCellMessage
         },
		 {
            key: "mood", label: this._msg("statuslist.table.header.mood"), sortable: true, formatter: renderCellMood
         }
			];
		
		 var columnDefinitions = columnDefinitionsGlobal;
		 if(!this.options.global) {
			columnDefinitions = columnDefinitionsSite;
		 }

         // DataTable definition
         YAHOO.widget.DataTable.MSG_EMPTY = this._msg("message.empty");
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-statuslist", columnDefinitions, this.widgets.dataSource,
         {
			initialRequest: this._buildStatusListParams(),
            renderLoopSize: 32
         });
      },
      
      /**
       * Resets the YUI DataTable errors to our custom messages
       * NOTE: Scope could be YAHOO.widget.DataTable, so can't use "this"
       *
       * @method _setDefaultDataTableErrors
       */
      _setDefaultDataTableErrors: function StatusList__setDefaultDataTableErrors()
      {
         var msg = Alfresco.util.message;
         YAHOO.widget.DataTable.MSG_EMPTY = this._msg("message.empty");
         YAHOO.widget.DataTable.MSG_ERROR = this._msg("message.error");
      },

      /**
       * Populate the status list via Ajax request
       * @method populateStatusList
       */
      populateStatusList: function StatusList_populateStatusList()
      {
	
         // Empty results table
         this.widgets.dataTable.deleteRows(0, this.widgets.dataTable.getRecordSet().getLength());

         var successHandler = function StatusList__pS_successHandler(sRequest, oResponse, oPayload)
         {
            this._setDefaultDataTableErrors();
            this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable, sRequest, oResponse, oPayload);
         }
         
         var failureHandler = function StatusList__pS_failureHandler(sRequest, oResponse)
         {
            if (oResponse.status == 401)
            {
               // Our session has likely timed-out, so refresh to offer the login page
               window.location.reload();
            }
            else
            {
               try
               {
                  var response = YAHOO.lang.JSON.parse(oResponse.responseText);
                  YAHOO.widget.DataTable.MSG_ERROR = response.message;
                  this.widgets.dataTable.showTableMessage(response.message, YAHOO.widget.DataTable.CLASS_ERROR);
               }
               catch(e)
               {
                  this._setDefaultDataTableErrors();
               }
            }
         }
	
	     this.widgets.dataSource.sendRequest(this._buildStatusListParams(),
         {
               success: successHandler,
               failure: failureHandler,
               scope: this
         });
      },
   
      /**
       * Build URI parameter string for doclist JSON data webscript
       *
       * @method _buildSearchParams
       * @param path {string} Path to query
       */
      _buildStatusListParams: function _buildStatusListParams()
      {
         var paramString = "site=" + encodeURIComponent(this.options.siteId);
	     paramString += "&global=" + encodeURIComponent(this.options.global);
	     paramString += "&history=" + encodeURIComponent(this.options.history);
	     paramString += "&user=" + encodeURIComponent(this.options.user);
		 return paramString;
      },   

      /**
       * Set messages for this component.
       *
       * @method setMessages
       * @param obj {object} Object literal specifying a set of messages
       * @return {Alfresco.DocumentList} returns 'this' for method chaining
       */
      setMessages: function StatusList_setMessages(obj)
      {
         Alfresco.util.addMessages(obj, this.name);
         return this;
      },

      /**
       * Gets a custom message
       *
       * @method _msg
       * @param messageId {string} The messageId to retrieve
       * @return {string} The custom message
       * @private
       */
      _msg: function StatusList__msg(messageId)
      {
         return Alfresco.util.message.call(this, messageId, "Optaros.StatusList", Array.prototype.slice.call(arguments).slice(1));
      }

   };
})();
