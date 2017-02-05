/** This is a sample code for your bot**/
function MessageHandler(context, event) {
    if (event.message.toLowerCase() == "get started") {
        var state = new Date().getTime();
        var button = {
            "type": "survey",
            "question": "To begin, you need to link your Quizlet account to ThothBot. Please press authorize!",
            "msgid": "authorizebutton",
            "options": [{
              "type": "url",
              "title": "Authorize",
              "url": "quizlet.com/authorize?response_type=code&client_id=4Hxdpv7gBE&scope=read%20write_set&state=" + state
            }]
        }
        context.sendResponse(JSON.stringify(button));
    }
}
/** Functions declared below are required **/
function EventHandler(context, event) {
    if(event.messageobj.text=='startchattingevent'&& event.messageobj.type=='event') {
      var button = {
          "type": "survey",
          "question": "To begin, you need to link your Quizlet account to ThothBot. Please press authorize!",
          "options": ["Authorize"],
          "msgid": "authorizebutton"
      }
    context.sendResponse(JSON.stringify(button));
  }
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    context.sendResponse(JSON.stringify(event.getresp));
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}
