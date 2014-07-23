// server.js

// BASE setup..

// Call the packages we need..
var Boilerpipe  = require('boilerpipe');
var TimerJob = require('timer-jobs');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var fs          = require('fs');
var URI         = require('uri-js');
var querystring = require('querystring');


var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);

mongoose.connection.on('connected', function ()   { console.log('connection successful..');   });
mongoose.connection.on('error',     function(err) { console.log('connection error: %s', err); return;});

console.log('connected to mongodb..');

var News        = require('../app/models/news');
var count = 0;

// here we can set the timer function..
getGoogleNews = function() {
  process.setMaxListeners(0);
  console.log("\n\nRun Triggered at %s", new Date());
  //d = Date.now();
  // d is "Sun Oct 13 2013 20:32:01 GMT+0530 (India Standard Time)"
  //datetext = d.toTimeString();
  // datestring is "20:32:01 GMT+0530 (India Standard Time)"
  // Split with ' ' and we get: ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"]
  // Take the first value from array :)
  //datetext = datetext.split(' ')[0];
  
  //console.log('\nStarting pull @ %s\n\n', datetext);
  try {
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=15&hl=en&topic=w&output=rss", function(err, articles) {
      if(err)  { console.log(err); }
      else {
        console.log('\ngetGoogleNews(): found %d articles\n\n', articles.length);
        count = articles.length;
        for(var i=0; i<articles.length; i++) {
          var components = URI.parse(articles[i].link);
          var query = querystring.parse(components.query);
          articles[i].link = query.url;
          processArticle(articles[i]);
        }
        
        //console.log('\n%s', JSON.stringify(articles[0], null, 2));
      }
  });
  } catch(ex) { console.log(ex); }
}

processArticle = function(article) {
  try {
    
    var query = News.findOne({'link' : article.link});
    query.exec(function(err, result) {
      if(err === null && result === null) { // add to db
        read(article.link, function(err, art, meta) { 
          if(art !== null && art !== undefined && err === null) {
            
            var n = News();
            n.title     = art.title.trim();
            n.author    = article.author.trim();
            n.link      = article.link;
            n.content   = stripHTML(art.content);
            n.html      = art.content;
            n.published = article.published;
            n.document  = art.document;
            n.words     = getWords(art.content);
            n.feed      = article.feed;
            n.save(function(err) {
              if(err) { console.log('save failed..\n\t%s\n\terr: %s\n', art.title.trim(), err); }
              else    { console.log('%s SAVED! %d remaining', art.title.trim(), count--); }
            });
          } 
        });
      } else {
        console.log('%s already in db.. %d remaining...', article.title.trim(), count--);
      }
    }); 
  } catch(ex) { console.log('processArticle() ex: ' + ex); }
}

function stripHTML(clean) {
  // Remove all remaining HTML tags.
  if(!clean) {
    console.log('stripHtml(): clean empty');
    return;
  }
  
  clean = clean.replace(/<(?:.|\n)*?>/gm, "");
  // RegEx to remove needless newlines and whitespace.
  // See: http://stackoverflow.com/questions/816085/removing-redundant-line-breaks-with-regular-expressions
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");

  // Return the final string, minus any leading/trailing whitespace.
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

getGoogleNews();

var someTimer = new TimerJob({interval: 600000}, function(done) {
  console.log("timer fired (10 min) @ %s.. ", new Date());
  getGoogleNews();
  done();
});

someTimer.start();
