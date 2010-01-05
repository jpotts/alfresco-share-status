/**
 * Copyright (C) 2005-2008 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
 
/**
 * MyStatus component.
 * 
 * @namespace Optaros
 * @class Alfresco.MyStatus
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
    * Status list constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.MySites} The new component instance
    * @constructor
    */
   Optaros.MyStatus = function MS_constructor(htmlId)
   {
      this.name = "Optaros.MyStatus";
      this.id = htmlId;

      /* Initialise prototype properties */
      this.widgets = {};
      
      // Register this component
      Alfresco.util.ComponentManager.register(this);

      // Load YUI Components
      Alfresco.util.YUILoaderHelper.require(["button", "container", "menu"], this.onComponentsLoaded, this);

      //YAHOO.Bubbling.on("siteDeleted", this.onSiteDeleted, this);

      return this;
   }

   Optaros.MyStatus.prototype =
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type {object} object literal
       */
      options:
      {
         siteId: ""
      },
      
      /**
       * Object container for storing YUI widget instances.
       * 
       * @property widgets
       * @type object
       */
      widgets: null,

      /**
       * Set multiple initialization options at once.
       *
       * @method setOptions
       * @param obj {object} Object literal specifying a set of options
       * @return {Optaros.MyStatus} returns 'this' for method chaining
       */
      setOptions: function MS_setOptions(obj)
      {
         this.options = YAHOO.lang.merge(this.options, obj);
         return this;
      },

      /**
       * Fired by YUILoaderHelper when required component script files have
       * been loaded into the browser.
       * @method onComponentsLoaded
       */
      onComponentsLoaded: function MS_onComponentsLoaded()
      {
         YAHOO.util.Event.onContentReady(this.id, this.onReady, this, true);
      },

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function MS_onReady()
      {
         // update button 
         this.widgets.updateButton = Alfresco.util.createYUIButton(this, "update-button", this.updateButtonClick);
         
         // prefix selection dropdown
         this.widgets.prefixSelect = Alfresco.util.createYUIButton(this, "prefix-button", this.onPrefixSelect,
         {
            type: "menu", 
            menu: "prefix-menu"
         });

         // mood selection dropdown
         this.widgets.moodSelect = Alfresco.util.createYUIButton(this, "mood-button", this.onMoodSelect,
         {
            type: "menu", 
            menu: "mood-menu"
         });
      },

      /**
       * Action handler for the prefix dropdown
       */
      onPrefixSelect: function MS_onPrefixSelect(sType, aArgs, p_obj)
      {
         var value = aArgs[1].value;
		 var label = aArgs[1].srcElement.text;
         if (value === "")
         {
            return;
         }
         this.widgets.prefixSelect.set('label', label);
         
         // prevent default actions
         var eventTarget = aArgs[1]
         Event.preventDefault(eventTarget);
      },

      /**
       * Action handler for the mood dropdown
       */
      onMoodSelect: function MS_onMoodSelect(sType, aArgs, p_obj)
      {
         var value = aArgs[1].srcElement.value;
 		 var labelElem = aArgs[1].element;
		 var label = YAHOO.util.Dom.getFirstChild(labelElem).innerHTML;
		
         if (value === "")
         {
            return;
         }
         this.widgets.moodSelect.set('label', label);
         
         // prevent default actions
         var eventTarget = aArgs[1]
         Event.preventDefault(eventTarget);
      },

      /**
       * Fired by YUI when the update button is clicked
       * 
       * @method updateButtonClick
       * @param event {domEvent} DOM event
       */
      updateButtonClick: function MS_updateButtonClick(e, p_obj)
      {
         // disable button
         this.widgets.updateButton.set("disabled", true);
         
         // get the message text
         var statusField = Dom.get(this.id + '-statustext');
         var message = statusField.value;
         
         // prefix
		 var prefix='';
		 var prefixMenu=this.widgets.prefixSelect.getMenu();
		 //we handle the first selected item different (=with extra caution)
		 if (!prefixMenu.activeItem) 
		 {
		   //prefix = prefixMenu.srcElement.options[0].value;
		   prefix = prefixMenu.srcElement.options[prefixMenu.srcElement.selectedIndex].value
		 }
		 else 
		 {
			prefix = prefixMenu.activeItem.srcElement.value;
		 }
		
         // mood
		 var mood='';
		 var moodMenu=this.widgets.moodSelect.getMenu();
		 //we handle the first selected item different (=with extra caution)
		 if (!moodMenu.activeItem) 
		 {
		   //mood = moodMenu.srcElement.value;
		   mood = getOrigMoodValue();
		 }
		 else 
		 {
			mood = moodMenu.activeItem.srcElement.value;
		 }
		         
         // done checkbox
         var doneCheckbox = Dom.get(this.id + '-done-checkbox');
         var isComplete = doneCheckbox.checked;

         // show a wait message
         this.widgets.feedbackMessage = Alfresco.util.PopupManager.displayMessage(
         {
            text: this._msg("message.wait"),
            spanClass: "wait",
            displayTime: 0
         });
         
         var statusData = {
            message: message,
            prefix: prefix,
            mood: mood,
            isComplete: isComplete
         };
         
         // kick off the processing
         this._updateStatus(statusData);
      },

      /**
       * Updates the user status
       * 
       * @param statusData the data to use
       */
      _updateStatus: function MS__updateStatus(statusData)
      {
         // success handler
         var success = function MS__updateStatus_success(response)
         {
            // remove wait message
            this.widgets.feedbackMessage.destroy();

            // check whether the task is done, reset the form in this case
            if (statusData.isComplete)
            {
               Dom.get(this.id + '-statustext').value = '';
               Dom.get(this.id + '-done-checkbox').checked = false;
            }
            
            // re-enable invite button
            this.widgets.updateButton.set("disabled", false);
            
            // Fire a statusUpdated event
            YAHOO.Bubbling.fire("statusUpdated",
            {
            });
         };

         var failure = function MS__updateStatus_failure(response)
         {
            // remove wait message
            this.widgets.feedbackMessage.destroy();
            
            // inform the user
            var message = this._msg("message.update.failure");
			Alfresco.util.PopupManager.displayMessage({text: message });
            
            // re-enable invite button
            this.widgets.updateButton.set("disabled", false);
         };
         
         // construct the url to call
         var url = YAHOO.lang.substitute(Alfresco.constants.PROXY_URI + "status/site/{site}/update?message={message}&prefix={prefix}&mood={mood}&isComplete={isComplete}",
         {
            site : this.options.siteId,
            message: statusData.message,
            prefix: statusData.prefix,
            mood: statusData.mood,
            isComplete: "" + statusData.isComplete
         });
         Alfresco.util.Ajax.request(
         {
            method: "POST",
            requestContentType: Alfresco.util.Ajax.JSON,
            responseContentType: Alfresco.util.Ajax.JSON,
            url: url,
            dataObj:
            {
               message: statusData.message,
               prefix: statusData.prefix,
               mood: statusData.mood,
               isComplete: "" + statusData.isComplete
            },
            successCallback:
            {
               fn: success,
               scope: this
            },
            failureCallback:
            {
               fn: failure,
               scope: this
            }
         });
      },
      
      /**
       * Set messages for this component.
       *
       * @method setMessages
       * @param obj {object} Object literal specifying a set of messages
       * @return {Alfresco.DocumentList} returns 'this' for method chaining
       */
      setMessages: function MS_setMessages(obj)
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
      _msg: function MS__msg(messageId)
      {
         return Alfresco.util.message.call(this, messageId, "Optaros.MyStatus", Array.prototype.slice.call(arguments).slice(1));
      }

   };
})();