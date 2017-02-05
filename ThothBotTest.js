 var message = null;
        function MessageHandler(context, event) {
            context.console.log("test")
            if(isNewUser(context)) {
                var state = new Date().getTime().toString();
                context.simpledb.roomleveldata.state = state;
                context.simpledb.doPut(state,event.contextobj);
                var button = {
                    "type": "survey",
                    "question": "To begin, you need to link your Quizlet account to ThothBot. Please press authorize!",
                    "msgid": "authorizebutton",
                    "options": [{
                    "type": "url",
                    "title": "Authorize",
                    "url": "quizlet.com/authorize?response_type=code&client_id=4Hxdpv7gBE&scope=write_set&state=" + state
                }]
                }
                context.sendResponse(JSON.stringify(button));
            }
            else if (event.message.toLowerCase()=="kill") {
                context.simpledb.roomleveldata.isnewuser = false;
                context.sendResponse("hi");
            } else if (event.message.toLowerCase()=="state") {
                context.sendResponse(context.simpledb.roomleveldata.state)
            }

       }
        function HttpEndpointHandler(context,event){
            var dbkey = event.params.state
            code = event.params.code;
            context.simpledb.doPut(dbkey+"code", "{\"code\":\""+code+"\"}");
            context.simpledb.doGet(dbkey);
        }

        function DbGetHandler(context, event) {
            var url = "https://api.gupshup.io/sm/api/bot/ThothBotTest/msg";  //The bot which is sending the message to the user.
            var header = {"apikey":"3da26936384d4476c40c6eac52573b96","Content-Type": "application/x-www-form-urlencoded"};
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
        
        function isNewUser(context) {
            var newuser = context.simpledb.roomleveldata.isnewuser;
            if (!newuser) {
                context.simpledb.roomleveldata.isnewuser = true;
                return true;
            } else {
                return false;
            }
        }