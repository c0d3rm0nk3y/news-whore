var schedule    = require('node-schedule');
var read        = require('node-readability');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var URI         = require('uri-js');
var q           = require('q');
var querystring = require('querystring');
var News        = require('../app/models/news');
var dbUri       = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);
mongoose.connection.on('connected', function ()   { console.log('connection successful..');   });
mongoose.connection.on('error',     function(err) { console.log('connection error: %s', err); return;});
console.log('connected to mongodb..');

var rule = new schedule.RecurrenceRule();
rule.minute = 42;

var job = schedule.scheduleJob(rule, function() {
  getFeed()
  .then(function(articles) {
    console.log('getFeed().then(function(articles).. %d', articles.length);
    return articles;
  })
  .then(function(articles) {
    getArticles(articles); 
  });
});

function getFeed() {
  try {
    var deferred = q.defer();
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=15&hl=en&topic=w&output=rss", function(err, articles) {
      if(err) { 
        console.log('getFeed() err: %s', err); 
      } else {
        deferred.resolve(articles);
      }
    });
    return deferred.promise;
  } catch(ex) { console.log('getFeed() ex: %s', ex); }
}

function getArticles(articles) {
  try {
    
    
    
    articles.forEach(function(article) {
      if(!isInDB(article.link)) {
        console.log('Not in DB - %s, proceeding', article.title.trim() );

        
        getArticle(article).then(
          function(result) {
            console.log('article readability successful\n' + JSON.stringify(result));
            
        }, 
          function(reason) {
            console.log('article readability failed');
        });
        
      } else {
        console.log("article already in db.. skipping");
      }
    });
    
    
  } catch(ex) { console.log('getArticles() ex: %s', ex); }
}

function getArticle(article) {
  try { 
    var d = q.defer();
    
    read(article.link, function(err, art, meta) { 
      if(art !== null && art !== undefined && err === null) {
        d.resolve(art);
      } else {
        d.reject(err);
      }
    });
    
    return d.promise;
  } catch(ex) { console.log('getArticle() ex: %s', ex); }
}



function isInDB(link) {
  try { 
    
    var query = News.findOne({'link' : link});
    query.exec(function(err, result) {
      if(err === null && result === null) { // add to db
        return false;
      } else {
        return true;
      }
    });
  } catch(ex) { console.log('queryDB() ex: %s...', ex);  }
}
