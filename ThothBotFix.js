var message = "";
var username;
var authCode;

function MessageHandler(context, event) {
  if (isNewUser(context)) {
    var state = new Date().getTime().toString();
    context.simpledb.roomleveldata.currentLearn = -1;
    context.simpledb.roomleveldata.roundNum = -1;
    context.simpledb.roomleveldata.state = state;
    context.simpledb.doPut(state, "{\"contextid\":\"" + event.contextobj.contextid +
      "\"}");
    var button = {
      "type": "survey",
      "question": "To begin, you need to link your Quizlet account to ThothBot. Please press authorize!",
      "msgid": "authorizebutton",
      "options": [{
        "type": "url",
        "title": "Authorize",
        "url": "quizlet.com/authorize?response_type=code&client_id=4Hxdpv7gBE&scope=read%20write_set&state=" +
          state
      }]
    };
    context.sendResponse(JSON.stringify(button));
  }
  if (event.message == "Main Menu") {
    var survey = {
      "type": "survey",
      "question": "Want to study?",
      "msgid": "mainmenu",
      "options": ["Learn", "Flash Quiz"]
    };
    context.sendResponse(JSON.stringify(survey));
    return;
  } else if (event.message.toLowerCase() == "resetbot") {
    context.simpledb.roomleveldata.isnewuser = false;
    context.sendResponse("User data reset. Chat anything to continue");
  } else if (event.message.toLowerCase() == "quitlearning") {
    if (context.simpledb.roomleveldata.currentLearn > -1) {
      quitLearnMode(context, event);
    } else {
      context.sendResponse("You're not learning right now!")
    }
  } else if (event.messageobj.refmsgid == 'persistent-menu') {
    if (context.simpledb.roomleveldata.currentLearn > -1) {
      if (event.message.toLowerCase() == "learn") {
        context.sendResponse("Learn");
      } else if (event.message.toLowerCase() == 'flash quiz') {
        context.sendResponse("Quiz");
      }
    } else if (event.message.toLowerCase() == 'quit learning') {
      quitLearnMode(context, event);
    } else {
      context.sendResponse("You're already learning!");
    }
  } else if (context.simpledb.roomleveldata.currentLearn > -1) {
    if (event.message.toLowerCase() != context.simpledb.roomleveldata.correctAnswer) {
      message = "\u2717\nAnswer was: " + context.simpledb.roomleveldata
        .correctAnswer + "\n";
      context.simpledb.roomleveldata.wrongAnswers.push(context.simpledb.roomleveldata
        .testTerms[context.simpledb.roomleveldata.indx]);
    } else {
      message = "\u2713\n";
    }
    //updateReport(context, event);
    learnMode(context, event);
    return;
  } else if (event.message.toLowerCase() == "state") {
    context.sendResponse(context.simpledb.roomleveldata.state);
  } else if (event.message.toLowerCase() == "quiz") {
    context.simpledb.doGet(context.simpledb.roomleveldata.state.toString());

    var list = {
      "type": "list",
      "topElementStyle": "compact",
      "msgid": "listselect",
      "items": [],
    };
    for (var i = 0; i < context.simpledb.roomleveldata.jsonlist.length; i++) {
      var item = {
        "title": context.simpledb.roomleveldata.jsonlist[i].title.toString(),
        "subtitle": context.simpledb.roomleveldata.jsonlist[i].term_count.toString() +
          " terms",
        "options": [{
          "type": "text",
          "title": "Quiz " + context.simpledb.roomleveldata.jsonlist[i].title
            .toString()
        }]
      };
      list['items'].push(item);
    }
  } else if (event.message.toLowerCase().substring(0, 4) == "quiz") {
    for (var i = 0; i < context.simpledb.roomleveldata.jsonlist.length; i++) {
      if (event.message.includes(context.simpledb.roomleveldata
          .jsonlist[i].title.toString().substring(0, 16))) {
        //context.sendResponse("learn");
        context.simpledb.roomleveldata.currentLearn = i;
        context.simpledb.roomleveldata.quizMode = true;
        initLearnMode(context, event);
        learnMode(context, event);
      }
    }
  } else if (event.message.toLowerCase() == "learn") {
    //var titles = context.simpledb.roomleveldata.jsonlist.title
    //var arrayLength = title.length;
    context.simpledb.doGet(context.simpledb.roomleveldata.state.toString());
    var list = {
      "type": "list",
      "topElementStyle": "compact",
      "msgid": "listselect",
      "items": [],
    };
    for (var i = 0; i < context.simpledb.roomleveldata.jsonlist.length; i++) {
      var item = {
        "title": context.simpledb.roomleveldata.jsonlist[i].title.toString(),
        "subtitle": context.simpledb.roomleveldata.jsonlist[i].term_count.toString() +
          " terms",
        "options": [{
          "type": "text",
          "title": "Learn " + context.simpledb.roomleveldata.jsonlist[i].title
            .toString()
        }]
      };
      list['items'].push(item);
    }

    context.sendResponse(JSON.stringify(list));
    return;
  } else if (event.message.toLowerCase().substring(0, 5) == "learn") {
    for (var i = 0; i < context.simpledb.roomleveldata.jsonlist.length; i++) {
      if (event.message.includes(context.simpledb.roomleveldata
          .jsonlist[i].title.toString().substring(0, 15))) {
        //context.sendResponse("learn");
        context.simpledb.roomleveldata.currentLearn = i;
        initLearnMode(context, event);
        learnMode(context, event);
      }
    }
  } else { // otherwise go to main menu
    var button = {
      "type": "survey",
      "question": "Not a valid command.",
      "msgid": "failure",
      "options": ["Main Menu"]
    };
    context.sendResponse(JSON.stringify(button));
  }
  /*else if (event.message.toLowerCase() == "dump") {
     context.simpledb.doGet(context.simpledb.roomleveldata.state.toString());
     //context.sendResponse(context.simpledb.roomleveldata.state.toString())
     //context.sendResponse(authCode + username);
   }*/


}

/*function updateReport(context, event) {
  var report = {
    "type": "quick_reply",
    "msgid": "reportbuttons",
    "options": [
      "Round: " + context.simpledb.roomleveldata.roundNum,
      "# Right: " + (context.simpledb.roomleveldata.jsonlist[context.simpledb
          .roomleveldata
          .currentLearn].term_count -
        context.simpledb.roomleveldata.wrongAnswers.length),
      "# Wrong: " + context.simpledb.roomleveldata.wrongAnswers.length
    ]
  };
  context.sendResponse(JSON.stringify(report));
}*/

function initLearnMode(context, event) {
  var ind = context.simpledb.roomleveldata.currentLearn;
  var list = context.simpledb.roomleveldata.jsonlist[ind];
  var terms = [];
  var learnLength;
  if (context.simpledb.roomleveldata.quizMode) {
    learnLength = ((list.term_count > 5) ? 5 : list.term_count);
  } else {
    learnLength = list.term_count;
  }
  for (i = 0; i < learnLength; i++) {
    terms[i] = i;
  }
  context.simpledb.roomleveldata.testTerms = shuffleArray(terms);
  context.simpledb.roomleveldata.roundNum = 1;
  context.simpledb.roomleveldata.wrongAnswers = [];
}

function learnMode(context, event) {
  if (context.simpledb.roomleveldata.testTerms.length === 0) {
    nextRound(context, event);
  } else {
    context.simpledb.roomleveldata.indx = context.simpledb.roomleveldata.testTerms[
      context.simpledb.roomleveldata.testTerms.length - 1];
    context.simpledb.roomleveldata.correctAnswer = context.simpledb.roomleveldata
      .jsonlist[context.simpledb
        .roomleveldata.currentLearn].terms[context.simpledb.roomleveldata.indx]
      .term.toLowerCase();
    context.simpledb.roomleveldata.testTerms.pop();
    context.sendResponse(message + context.simpledb.roomleveldata.jsonlist[
        context.simpledb
        .roomleveldata.currentLearn].terms[context.simpledb.roomleveldata.indx]
      .definition);
  }
}

function nextRound(context, event) {
  if (context.simpledb.roomleveldata.quizMode) {
    quitLearnMode(context, event);
  } else if (context.simpledb.roomleveldata.wrongAnswers.length === 0) {
    context.simpledb.roomleveldata.currentLearn = -1;
    context.simpledb.roomleveldata.quizMode = false;
    context.sendResponse("Total rounds: " + context.simpledb.roomleveldata.roundNum +
      "\nStudy session complete!");
    return;
  } else {
    context.simpledb.roomleveldata.testTerms = shuffleArray(context.simpledb.roomleveldata
      .wrongAnswers);
    context.simpledb.roomleveldata.roundNum++;
    learnMode(context, event);
  }
}

function quitLearnMode(context, event) {
  // set completed
  context.simpledb.roomleveldata.currentLearn = -1;
  context.simpledb.roomleveldata.quizMode = false;
  context.sendResponse("Study session complete!");
  return;
}

function HttpEndpointHandler(context, event) {
  var dbkey = event.params.state;
  code = event.params.code;
  username = event.params.username;
  context.simpledb.doPut(dbkey.toString(), "{\"code\":\"" + code +
    "\",\"username\":\"" + username + "\"}");
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
  context.simplehttp.makeGet('http://thothbot.000webhostapp.com/get.php?code=' +
    authCode + '&username=' + username);

  context.sendResponse("Main Menu");
}

function DbPutHandler(context, event) {
  context.sendResponse("Hello " + event.sender);
}

function HttpResponseHandler(context, event) {
  var json = JSON.parse(event.getresp);
  context.simpledb.roomleveldata.jsonlist = json;
  //context.sendResponse(event.getresp);
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

function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
