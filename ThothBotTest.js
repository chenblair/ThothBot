 var message = null;
        function MessageHandler(context, event) {
            context.console.log("test")
            if(isNewUser(context)) {
                var state = new Date().getTime().toString();
                context.simpledb.doPut(state,event.contextobj);
             }
       }
        function HttpEndpointHandler(context,event){
            var dbkey= event.params.key
            message = event.params.message;
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