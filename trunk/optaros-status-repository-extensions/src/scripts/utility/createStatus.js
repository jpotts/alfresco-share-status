var siteId = "greenenergy";
var userName = person.properties["cm:userName"];
//var userName = "tuser7";
var contentName = "status";
var prefix = "Finished";
var message = "test status message";

// create a new status node as child of the current node and set its properties
var timestamp = new Date().getTime();
var statusNode = space.createNode(contentName + timestamp, "optStatus:status");
statusNode.properties["cm:name"] = contentName + " (" + timestamp + ")";
statusNode.properties["{http://www.optaros.com/model/status/1.0}siteId"] = siteId;
statusNode.properties["optStatus:message"] = message;
statusNode.properties["optStatus:prefix"] = prefix;
statusNode.properties["optStatus:mood"] = 1;
statusNode.properties["optStatus:complete"] = false;
statusNode.properties["optStatus:user"] = userName;
statusNode.content = prefix + " " + message;
statusNode.save();
//associations make it harder to search for this object later so we'll just use the username
//statusNode.createAssociation(person, "optStatus:forPerson");

