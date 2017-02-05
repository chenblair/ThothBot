 var message = null;
 var username;
 var authCode;
        function MessageHandler(context, event) {
            context.console.log("test")
            if(isNewUser(context)) {
                var state = new Date().getTime().toString();
                context.simpledb.roomleveldata.state = state;
                context.simpledb.doPut(state.toString(),event.contextobj);
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
            else if (event.message.toLowerCase()=="kill") {
                context.simpledb.roomleveldata.isnewuser = false;
                context.sendResponse("hi");
            } else if (event.message.toLowerCase()=="state") {
                context.sendResponse(context.simpledb.roomleveldata.state)
            } else if (event.message.toLowerCase()=="listme") {
                var lists = ["French","Spanish","Portugese"]
                var arrayLength = lists.length;
                var list ={
                    "type": "list",
                    "topElementStyle": "compact",
                    "msgid": "list123",
                    "items": [],
                };
                for (var i = 0; i < arrayLength; i++) {
                    var item = {
                        "title": lists[i],
                        "subtitle":"language",
                        "options": [ {
                            "type": "text",
                            "title": "learn"
                        }
                        ]
                    }
                    list['items'].push(item);
                }

    context.sendResponse(JSON.stringify(list));
    return;
            } else if (event.message.toLowerCase()=="dump") {
                //context.sendResponse(context.simpledb.roomleveldata.state.toString())
                context.simpledb.doGet(context.simpledb.roomleveldata.state.toString());
                //context.sendResponse(authCode + username);
            }

       }
        function HttpEndpointHandler(context,event){
            var dbkey = event.params.state;
            code = event.params.code;
            username = event.params.username;
            context.simpledb.doPut(dbkey.toString(), "{\"code\":\""+code+"\",\"username\":\""+username+"\"}");
        }

        function DbGetHandler(context, event) {
            //var url = "https://api.gupshup.io/sm/api/bot/ThothBotTest/msg";  //The bot which is sending the message to the user.
            //var header = {"apikey":"3da26936384d4476c40c6eac52573b96","Content-Type": "application/x-www-form-urlencoded"};
            //var contextobj = event.dbval;
            //var param = "context="+contextobj+"&message="+message;
            //context.simplehttp.makePost(url,param,header);
            //context.sendResponse(event.dbval.toString());
            var userObj = JSON.parse(event.dbval);
            username = userObj.username;
            authCode = userObj.code;
            //context.sendResponse(authCode + username);
            context.simplehttp.makeGet('http://thothbot.000webhostapp.com/get.php?code='+authCode+'&username='+username);
        }

        function DbPutHandler(context, event) {
             context.sendResponse("Hello "+event.sender);
        }

        function HttpResponseHandler(context,event){
            var json = JSON.parse(event.getresp);
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