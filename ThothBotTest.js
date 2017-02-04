/** This is a sample code for your bot**/
function MessageHandler(context, event) {
    context.console.log("test")
    if(event.message.toLowerCase() == "httptest") {
        context.simplehttp.makeGet("http://ip-api.com/json");
    }
    else if(event.message.toLowerCase() == "testdbget") {
        context.simpledb.doGet("putby")
    }
    else if(event.message.toLowerCase() == "testdbput") {
        context.simpledb.doPut("putby", event.sender);
    }
    else if(event.message== "hi") {
        context.simpledb.doPut(event.sender,event.contextobj);
    } else {
        context.sendResponse('No keyword found : '+event.message); 
    }
}
/** Functions declared below are required **/
function EventHandler(context, event) {
    if(! context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    context.sendResponse("Thanks for adding me. You are:" + numinstances);
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    context.sendResponse(event.getresp);
}


/** This is a sample code for your bot**/
        function HttpEndpointHandler(context,event){    
            var dbkey= event.params.key
            message = event.params.message;
            context.simpledb.doGet(dbkey);

        }

        function DbGetHandler(context, event) {
            var url = "https://api.gupshup.io/sm/api/bot/botname/msg";  //The bot which is sending the message to the user.
            var header = {"apikey":"3da26936384d4476c40c6eac52573b96","Content-Type": "application/x-www-form-urlencoded"};  // you can get the API key from https://www.gupshup.io/developer/docs/bot-api/bot-api-ref
            var contextobj = event.dbval;
            var param = "context="+contextobj+"&message="+message;
             context.simplehttp.makePost(url,param,header);
        }

        function DbPutHandler(context, event) {
             context.sendResponse("Hello "+event.sender);
        }

        function HttpResponseHandler(context,event){
            context.sendResponse(event.getresp);
        }
