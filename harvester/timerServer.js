var TimerJob    = require('timer-jobs');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var URI         = require('uri-js');
var querystring = require('querystring');

var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);
mongoose.connection.on('connected', function ()   { console.log('connection successful..');   });
mongoose.connection.on('error',     function(err) { console.log('connection error: %s', err); return;});
//console.log('connected to mongodb..');

processGoogleNews = function() {
  try {
    
    
  } catch(ex) { console.log('processGoogleNews') }
}

getGoogleNews = function () {
  try {
    var d = q.deffered();
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=100&hl=en&topic=w&output=rss", function(err, articles) {
      d.resolve(articles);
    });
    return d.promise;
  } catch(ex) { console.log('getGoogleNews() ex: %s', ex); }
}

getArticles = function() {
  try {
    
  } catch(ex) { console.log('getGoogleArticles() ex: %s', ex); }
}

processArticle = function(article) {
  try {
    
  } catch(ex) { console.log('processArticle() ex: %s', ex); }
}

isInDB = function(link) {
  try {
    
  } catch(ex) { console.log('isInDB() ex: %s', ex); }
}

function stripHTML(clean) {
  // Remove all remaining HTML tags.
  if(!clean) { console.log('stripHtml(): clean empty');  return; }
  clean = clean.replace(/<(?:.|\n)*?>/gm, "");
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");
  return clean.trim();
}

getWords = function(content) {
  try {
  var c = content.replace(/<img[^>]*>/g,"");
  c = c.replace(/<iframe[^>]*>/g,"");
  words = c.replace(/<\/?[^>]+(>|$)/g, "").split(" ");
  var temp = [];
  for(var i = 0; i<words.length; i++) { 
    if(words[i].trim() !== "")
      i && temp.push(words[i].trim()); 
  }
  words = temp;
  delete temp;
  return words;
  }catch(e) {console.log(e); return ['error'];}
}

var someTimer = new TimerJob({interval: 600000}, function(done) {
  console.log(new Date());
  done();
});

console.log(new Date());
someTimer.start();