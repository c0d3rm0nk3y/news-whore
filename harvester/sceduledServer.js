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
rule.minute = 15;

var job = schedule.scheduleJob(rule, function() {
  getFeed()
  .then(function(articles) {
    return articles;
  })
  .then(getArticles(articles) {
    
  });
});

var getFeed = function() {
  try {
    var d = q.defer();
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=15&hl=en&topic=w&output=rss", function(err, articles) {
      if(err) { console.log('getFeed() err: %s', err); return; }
      d.resolve(articles);
    }
    return d.promise;
  } catch(ex) { console.log('getFeed() ex: %s', ex); }
}

var getArticles = function(articles) {
  try {
    var promises = [];
    
    articles.forEach(function(article) {
      var d = q.deffer();
      getArticle(article).then(function(result) {
        d.resolve(result);
      });
      
      promises.push(d.promise);
    });
    
    q.allSettled(promises).then(function(results) {
      results.forEach(function(result) {
        if(result.state === 'fulfilled') {
          // result.value
        } else {
          // result.reason
        }
      });
    });
  } catch(ex) { console.log('getArticles() ex: %s', ex); }
}

var getArticle = function(article) {
  try { 
    var d = q.defer();
    
    
    
    return d.promise;
  } catch(ex) { console.log('getArticle() ex: %s', ex); }
}




}