//create db - mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.IP + '/test');

 var kittySchema2 = mongoose.Schema({ name: String });
 var Kitten = mongoose.model('Kitten3', kittySchema2);
      
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//   db.once('open', function callback () {
//       console.log('db is connected');
//   });
var saveToDb = function (name)
{
     console.log('trial started');
  
      var silence = new Kitten({ name: name });
      silence.save(function (err,silence){
         if (err)
         {
             console.log('error in saving silence');
         }
         else {
             console.log('saved to db' + name);
         }
      });
     
      
};

var getFromDb = function (name)
{
     
      (Kitten.find({name:name})).exec(function (err, kittens) {
          if (err)
          {
              console.log('error finding silence');
          }
          else
          {
              console.log(kittens);
          }
      });
}


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


var sys = require("sys"),  
my_http = require("http"); 
var url = require('url') ;
var querystring = require('querystring');
var num = 1;
my_http.createServer(function(request,response){  
 
     if(request.method == 'POST') {
        processPost(request, response, function() {
            console.log(response.post);
            console.log('got response');
            // Use response.post here

            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            response.write("Hello World post");
            response.end();
        });
    } else {
        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
         var queryObject = url.parse(request.url,true).query;
         console.log(queryObject.name);
         if (queryObject.name !== undefined)
         {
              saveToDb(queryObject.name);
         }
        
        console.log('got response get' + num);
        response.write("Hello" + queryObject.name);
        response.end();
        num++;
    }
}).listen(8080);  
sys.puts("Server Running on 8080");