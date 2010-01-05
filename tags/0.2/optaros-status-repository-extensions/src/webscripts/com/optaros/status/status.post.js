<import resource="classpath:alfresco/extension/scripts/optarosStatus.js">

function getParams() {
	var siteId = url.templateArgs.siteId;
	// PENDING: all other alfresco posts the data as json, not as part of the url.
	// couldn't get json working (not sure why - and the javascript debugger seems to be broken
	// right now, so can't investigate further)
	var message = args.message; 
	var prefix = args.prefix;
	var mood = args.mood;
	mood = Number(mood);
	if (isNaN(mood))
	{
	   mood = 1; //Smiley face
	}
	
	var isComplete = args.isComplete;
	var user = person.properties["cm:userName"];

	return {
		"siteId": siteId,
		"userName" : user,
		"message" : message,
		"prefix" : prefix,
		"mood" : mood,
		"isComplete" : isComplete
	};
}

function main() {
	var params = getParams();
   var result = updateStatusObject(params);
   model.result = result;
}

main();
