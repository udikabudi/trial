var mongoose = require('mongoose');

// var uristring =
// process.env.MONGOLAB_URI ||
// process.env.MONGOHQ_URL ||
// 'mongodb://localhost/HelloMongoose';

var uristring = 'mongodb://localhost/totoDb';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
var connectToDb = mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});


var db = mongoose.connection;

var dropDb = db.db.dropDatabase(function(err)
{
    if (!err)
    {
        console.log("db dropped");
    }
    else
    {
        console.log("error");
    }
});
db.on('error', console.error.bind(console, 'connection error:'));

/**
 *  define the schemas and modules of db
 * ******************************************
 * ******************************************
 * ******************************************
 **/

//questions schema
var questionSchema = mongoose.Schema({ 
    question: { type: String, required: true }, 
    expirationDate: Date, 
    realAnswer: {type:String, required:true }, 
    poinst: {type: Number, required:true}
    
    });
    
var questions  = mongoose.model('questions', questionSchema);

// users schema
var userSchema = mongoose.Schema ({
   // userId: {type: Number, required: true }, //check if unique
    userName: {type: String, required: true},
    userPass: {type: String, required: true},
    userEmail: {type: String, requird: true},
    //user tournaments
    tournaments: [{type: mongoose.Schema.Types.ObjectId, ref:'tournaments'}]
});

var users  = mongoose.model('users', userSchema);

//tournaments schema
var tournamentsSchema =  mongoose.Schema ({
    //_id: {type: Number ,required: true},
    name: {type: String, required: true },
    type: {type: String, required: false},
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'questions' }],
    users:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    usersEmail: [{type: String, ref: 'users'}]
});

var tournaments  = mongoose.model('tournaments', tournamentsSchema);

//guesses schema
var guessesSchema = mongoose.Schema ({
    tournamentId: {type: mongoose.Schema.Types.ObjectId, ref:'tournaments', required:true}, 
    userId: {type:Number, ref:'users', required:true},
    questionId:{type: mongoose.Schema.Types.ObjectId, ref:'questions', required:true},
    name: {type: String, required: true },
    type: {type: String, required: false},
    answer: String,
    score: Number
});

var guesses  = mongoose.model('guesses', guessesSchema);

/**
 ************************* 
 **************************
 **/
 
/**
 * functions to save and find from db
 * ***********************************
 * ***********************************
 * **/
 
 var saveNewUserToDb = function saveUser (name, email, pass, callback)
 {
     var id = 0;
     //find the max id, set id to +1, pre save check if its unique and save
     var user = new users({userName:name, userEmail:email, userPass:pass } );
      user.save(function (err,user){
         if (err)
         {
             console.log('error in saving user');
             callback(id, err);
         }
         else {
             console.log('saved to db' + user._id);
             callback(user._id, err);
         }
      });
 };
 
 var saveQuestionToDb = function saveQuestion (_question, answer, _points, callback)
 {
    //   question: { type: String, required: true }, 
    // expirationDate: Date, 
    // realAnswer: {type:String, required:true }, 
    // poinst: {type: Number, required:true}
    
    var question = new questions({question:_question, realAnswer:answer, poinst:_points});
    question.save(function (err,question){
         if (err)
         {
             console.log('error in saving question');
             callback(-1, err);
         }
         else {
             console.log('questio saved to db' + question._id);
             callback(question._id, err);
         }
      });
 };
 
 var saveTournamentToDb = function saveTournament(_questions, _usersEmails, _name, callback)
 {
    // name: {type: String, required: true },
    // type: {type: String, required: false},
    // questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'questions' }],
    // users:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    // usersEmail: [String]  
    
   
    //get the questions ids:
    var query = questions.find({question:{$in:(_questions)}}).sort('-_id');
    query.select('_id');
    query.exec(function (err, questionsIds) {
        if (err)
        {
            
        }
        else
        {
            //save tournament to db
            var tour = new tournaments({name: _name, type:"world_cup", questions:questionsIds, usersEmails:_usersEmails });
             tour.save(function (err,tournament){
             if (err)
             {
                 console.log('error in saving tournament');
                 callback(-1, err);
             }
             else {
                console.log('tournament saved to db' + tournament._id);
                 callback(tournament._id, err);
             }
      });
        }
 
    });
 
 };
 
 //get tournament from Db
 var getTournamentFromDb = function getTournament(tournamentId, callback)
 {
     tournaments.findOne({'_id' : tournamentId}, function (err,tournament){
        if (err)
        {
            callback(-1, err);
        }
        else
        {
            callback (tournament, err);
        }
     });
 };
 
 //get questions of tournament
 var getQuestionsOfTournament = function getQuestionsTournament (tournamentId, callback)
 {
     var query = tournaments.find({'_id' : tournamentId}).populate('questions');
     query.exec(function(err, questions){
        if (err)
        {
            callback(-1, err);
        }
        else
        {
            callback (questions, err);
        }
     });
 };
 
 module.exports.saveNewUserToDb = saveNewUserToDb;
 module.exports.connect = connectToDb;
 module.exports.dropDb = dropDb;
 module.exports.saveQuestionToDb = saveQuestionToDb;
 module.exports.saveTournamentToDb = saveTournamentToDb;
 module.exports.getTournamentFromDb = getTournamentFromDb;

//  var kittySchema2 = mongoose.Schema({ name: String });
//  var Kitten = mongoose.model('Kitten3', kittySchema2);
      

//   db.once('open', function callback () {
//       console.log('db is connected');
//   });
var saveToDb = function (name)
{
  
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
