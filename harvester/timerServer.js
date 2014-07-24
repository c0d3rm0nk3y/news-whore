var TimerJob    = require('timer-jobs');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var URI         = require('uri-js');
var querystring = require('querystring');
var News        = require('../app/models/news');
var dbUri       = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';


//console.log('connected to mongodb..');

/*
  not ignoring postivies in db
*/

processGoogleNews = function() {
  console.log('processGoogleNews()..');
  mongoose.connect(dbUri);
  mongoose.connection.on('connected', function ()   { console.log('connection successful..');   });
  mongoose.connection.on('error',     function(err) { console.log('connection error: %s', err); return;});
  try {
    getGoogleNews()
      .then(function(articles) {
        processArticles(articles);
    });
    
  } catch(ex) { console.log('processGoogleNews') }
}

getGoogleNews = function () {
  //console.log('getGoogleNews()..');
  try {
    var d = q.defer();
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=100&hl=en&topic=w&output=rss", function(err, articles) {
      d.resolve(articles);
    });
    return d.promise;
  } catch(ex) { console.log('getGoogleNews() ex: %s', ex); }
}

processArticles = function(articles) {
  //console.log('processArticles()..');
  try {
    var index = 0;
    articles.forEach(function(article) {
      
        //console.log(new Date() + ': setTimeout() fired for new..');
        isInDB(article.link).then(function(result) {
          setTimeout(function() {
            console.log('isInDb().result: %s', result);
            if(!result) {
              console.log('NEW! %s, proceeding..', article.title.trim());
              readabilify(article).then(
                function(art) {
                  saveToDB(art,article).then(
                    function(result) { console.log(result); }, 
                    function(err) { console.log(err); });
                }, 
                function(err) {
                  console.log('readabilityError: %s', err);
                });
            } else {
              console.log('STALE! %s, ignored..', article.title.trim());
            }
          },5000);
        });
        
      
    });  
  } catch(ex) { console.log('processArticle() ex: %s', ex); }
}

readabilify = function(article) {
  //console.log('readabilify()..');
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
  } catch(ex) { console.log('getGoogleArticles() ex: %s', ex); }
}

saveToDB = function(art, article) {
  //console.log('saveToDB()..');
  try {
    var d = q.defer();
    var components = URI.parse(link);
    var qu = querystring.parse(components.query);
    var n = News();
            n.title     = art.title.trim();
            n.author    = article.author.trim();
            n.link      = qu.url;
            n.content   = stripHTML(art.content);
            n.html      = art.content;
            n.published = article.published;
            n.document  = art.document;
            n.words     = getWords(art.content);
            n.feed      = article.feed;
    n.save(function(err) {
      if(err) {  d.reject(err); }
      else    { d.resolve(art.title.trim() + ' SAVED!'); }
    });
    return d.promise;
  } catch(ex) { console.log('saveToDB() ex: %s', ex);  }
}

isInDB = function(link) {
  //console.log('isInDB()..');
  try {
    var components = URI.parse(link);
    var qu = querystring.parse(components.query);
    //articles[i].link = query.url;
    //console.log('testing link: %s', qu.url);
    var d = q.defer();
    var query = News.findOne({'link' : qu.url});
    query.exec(function(err, result) {
      if(err === null && result === null) { // add to db
        d.resolve(false);
      } else {
        console.log('in db..');  
        d.resolve(true);
      }
    });
    return d.promise;
  } catch(ex) { console.log('isInDB() ex: %s', ex); }
}

function stripHTML(clean) {
  //console.log('stripHTML()..');
  // Remove all remaining HTML tags.
  if(!clean) { console.log('stripHtml(): clean empty');  return; }
  clean = clean.replace(/<(?:.|\n)*?>/gm, "");
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");
  return clean.trim();
}

getWords = function(content) {
  //console.log('getWords()..');
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

var someTimer = new TimerJob({interval: 900000}, function(done) {
  console.log(new Date());
  processGoogleNews();
  done();
});

console.log(new Date());
someTimer.start();

processGoogleNews();