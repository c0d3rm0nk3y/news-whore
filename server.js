// server.js

// BASE setup..

// Call the packages we need..

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var Boilerpipe  = require('boilerpipe');
var read        = require('readabliity-node');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');


var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);

console.log('connected to mongodb..');

var News        = require('./app/models/news');

// config app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// ---------------------------------
var router = express.Router();  // get instance of express router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('being hailed captain.. appears to be right wing propoganda..');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everyting is working..
router.get('/', function(req, res) {
  res.json({message: 'hooray! welcome to our api!'});
});

// more routes below..
// on routes that end in /news
router.route('/news')
  // create a news entry..
.post(function(req, res) {
  // Create new instance of the news model..
  var news = new News();
  
  news.title = req.body.title;
  news.author = req.body.author;
  news.link = req.body.link;
  news.content = req.body.content;
  news.published = req.body.published;
  news.words = req.body.words;
  news.feed = req.body.feed;
  
  news.save(function(err) {
    if(err) res.send(err);
    
    res.json({message:'news created'});
  });
  
})
.get(function(req, res) {
    News.find(function(err, news) {
      if(err) res.send(err);
      
      res.json(news);
    });
  });

router.route('/source')
.post(function(req,res){
  
})
.get(function(req, res) {});

// REGISTER OUR ROUTES -------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ---------------------------
app.listen(port);
console.log('magic happens on port ' + port);

// here we can set the timer function..
startTimer = function() {
  var tmr = setInterval(timerFired(), 300000);
}

timerFired = function() {
  console.log('timer fired..');
}


// 
startTimer();
