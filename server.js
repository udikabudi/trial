


function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            response.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

var dbHelper = require("./totoDbHelper");
dbHelper.connectToDb;
//dbHelper.dropDb;

function saveUsersToDb ()
{
    dbHelper.saveNewUserToDb("udi", "udizohar84@gmail.com", "1234", function(id,err){
        if (err)
        {
            console.log("error saving user");
        }
  });
  
   dbHelper.saveNewUserToDb("tomer", "tomer@gmail.com", "1234", function(id,err){
        if (err)
        {
            console.log("error saving user");
        }
  });
  
   dbHelper.saveNewUserToDb("arnon", "arnon@gmail.com", "1234", function(id,err){
        if (err)
        {
            console.log("error saving user");
        }
  });
  
   dbHelper.saveNewUserToDb("tom", "tom@gmail.com", "1234", function(id,err){
        if (err)
        {
            console.log("error saving user");
        }
  });
  
   dbHelper.saveNewUserToDb("john", "john@gmail.com", "1234", function(id,err){
        if (err)
        {
            console.log("error saving user");
        }
  });
}
//saveUsersToDb();
var question1 = "france:england";
var question2 = "argentina:netherland";
var question3 = "brazil:chile";
function saveQuestionsToDb (callback)
{
    dbHelper.saveQuestionToDb(question1, "5:4", 3, function(id,err){
        if (err)
        {
            console.log("error saving question" + question1 );
        }
        else
        {
             dbHelper.saveQuestionToDb(question2, "3:1", 3, function(id,err){
                if (err)
                {
                    console.log("error saving question" + question2);
                }
                else
                {
                     dbHelper.saveQuestionToDb(question3, "2:2", 3, function(id,err){
                        if (err)
                        {
                            console.log("error saving question" + question3);
                        }
                        else
                        {
                            callback();
                        }
                    });
                }
            });
        }
    });
}

// saveQuestionsToDb(function (){
//   //save tournament
//   //_questions, _usersEmails, _name, callback
//   var questions = [question1, question2, question3]
//   var usersEmails = ["udizohar84@gmail.com", "tomer@gmail.com", "arnon@gmail.com", "tom@gmail.com", "john@gmail.com" ];
//   dbHelper.saveTournamentToDb(questions,usersEmails, "starters", function(id, error){
//       if (error)
//       {
//           console.log("error saving tournament");
//       }
//       else
//       {
//           console.log("tournament saved" + " " + id);
//       }
//   } );
// });



var sys = require("sys"),  
my_http = require("http"); 
var url = require('url') ;
var querystring = require('querystring');
var num = 1;
my_http.createServer(function(request,response){ 
    
    console.log("called to my server");
   
  
         
  if(request.method == 'POST') 
  {
       processPost(request, response, function() {
            console.log(response.post);
            console.log('got response');
           

            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            response.write("Hello World post" + response.post);
            response.end();
        });
  }
  else
  {
       var queryData;
       response.writeHead(200, {"Content-Type": "text/html"});
      // request.on('data', function(data) {
        queryData = url.parse(request.url, true).query;
        console.log("query is - " + queryData.d);
        if (queryData.d !== undefined)
        {
            if (queryData.d == "intialize")
            {
                saveUsersToDb();
                saveQuestionsToDb(function (){
                  //save tournament
                  //_questions, _usersEmails, _name, callback
                  var questions = [question1, question2, question3];
                  var usersEmails = ["udizohar84@gmail.com", "tomer@gmail.com", "arnon@gmail.com", "tom@gmail.com", "john@gmail.com" ];
                  dbHelper.saveTournamentToDb(questions,usersEmails, "starters", function(id, error){
                      if (error)
                      {
                          console.log("error saving tournament");
                      }
                      else
                      {
                          console.log("tournament saved" + " " + id);
                      }
                  } );
                });

            }
            else
            {
              dbHelper.getTournamentFromDb(queryData.d, function (tournament,err){
                   if (err)
                   {
                       response.write("cant get tournament" + " " + tournament);
                       response.end();
                       console.log("error in query");
                       
                   }
                   else
                   {
                        response.write("tournament name is" + " " + tournament.name);
                        response.end();
                        console.log("query success");
                       
                   }
                });
            }
        }
      //  });

        // request.on('end', function() {
           
        // });
  }
 
    //  if(request.method == 'POST') {
    //     processPost(request, response, function() {
    //         console.log(response.post);
    //         console.log('got response');
    //         Use response.post here

    //         response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    //         response.write("Hello World post");
    //         response.end();
    //     });
    // } else {
    //     response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    //      var queryObject = url.parse(request.url,true).query;
    //      console.log(queryObject.name);
    //      if (queryObject.name !== undefined)
    //      {
    //           saveToDb(queryObject.name);
    //      }
        
    //     console.log('got response get' + num);
    //     response.write("Hello" + queryObject.name);
    //     response.end();
    //     num++;
    // }
}).listen(process.env.PORT);  
sys.puts("Server Running on" + process.env.PORT);