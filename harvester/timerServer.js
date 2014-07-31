var TimerJob    = require('timer-jobs');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var URI         = require('uri-js');
var querystring = require('querystring');
<<<<<<< HEAD
var News        = require('../app/models/news');
var dbUri       = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';
mongoose.connect(dbUri);
mongoose.connection.on('connected', function ()   { console.log('connection successful..');   });
mongoose.connection.on('error',     function(err) { console.log('connection error: %s', err); return;});

//console.log('connected to mongodb..');

/*
  not ignoring postivies in db
*/

processGoogleNews = function() {
  console.log('\033[2J');
  console.log(new Date());
  console.log('\n\n\nprocessGoogleNews()..');
  
  try {
    getGoogleNews()
      .then(function(articles) {
        var arts = correctLinks(articles);
        startProcessing(arts);
    });
    return;
  } catch(ex) { console.log('processGoogleNews') }
}

correctLinks = function(articles) {
  try {
    console.log('correctLinks()..');
    for(var i =0; i<articles.length; i++) {
      var components = URI.parse(articles[i].link);
      var qu = querystring.parse(components.query);
      articles[i].link = qu.url;
      //console.log(qu.url);
    }
    return articles;
  } catch(ex) { console.log('correctLinks() ex: %s', ex); }
}

getGoogleNews = function () {
  console.log('getGoogleNews()..');
  try {
    var d = q.defer();
=======

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
>>>>>>> 3d6f6d85ffc4e6ef56c171d32a185469b1a29def
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=100&hl=en&topic=w&output=rss", function(err, articles) {
      d.resolve(articles);
    });
    return d.promise;
  } catch(ex) { console.log('getGoogleNews() ex: %s', ex); }
}

<<<<<<< HEAD
startProcessing = function(articles) {
  try {
    articles.forEach(function(article) {
      setTimeout(function() {
        isInDB(article.link).then(function(result) {
          //console.log('isInDb().result: %s', result);
          if(!result) {
            //console.log('NEW! %s, proceeding..', article.title.trim());
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
        });
      }, 10000);
    });
  } catch(ex)  { console.log('startProcessing().. ex: %s', ex); }
}

processArticles = function(articles) {
  console.log('processArticles()..');
  try {
    var index = 0;
    articles.forEach(function(article) {
      // here is where you need to resolve the 
      // link
      
        //console.log(new Date() + ': setTimeout() fired for new..');
      isInDB(article.link).then(function(result) {
        
        setTimeout(function() {
          //console.log('isInDb().result: %s', result);
          if(!result) {
            //console.log('NEW! %s, proceeding..', article.title.trim());
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
      if(err) {  d.reject(err); }
      else    { d.resolve("FRESH! " + art.title.trim() + ' SAVED!'); }
    });
    return d.promise;
  } catch(ex) { console.log('saveToDB() ex: %s', ex);  }
}

isInDB = function(link) {
  //console.log('isInDB()..');
  try {
    //var components = URI.parse(link);
    //var qu = querystring.parse(components.query);
    //articles[i].link = query.url;
    //console.log('testing link: %s', qu.url);
    var d = q.defer();
    var query = News.findOne({'link' : link});
    query.exec(function(err, result) {
      if(err === null && result === null) { // add to db
        d.resolve(false);
      } else {
        //console.log('in db..');  
        d.resolve(true);
      }
    });
    return d.promise;
=======
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
    
>>>>>>> 3d6f6d85ffc4e6ef56c171d32a185469b1a29def
  } catch(ex) { console.log('isInDB() ex: %s', ex); }
}

function stripHTML(clean) {
<<<<<<< HEAD
  //console.log('stripHTML()..');
=======
>>>>>>> 3d6f6d85ffc4e6ef56c171d32a185469b1a29def
  // Remove all remaining HTML tags.
  if(!clean) { console.log('stripHtml(): clean empty');  return; }
  clean = clean.replace(/<(?:.|\n)*?>/gm, "");
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");
  return clean.trim();
}

getWords = function(content) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 3d6f6d85ffc4e6ef56c171d32a185469b1a29def
  }catch(e) {console.log(e); return ['error'];}
}

var someTimer = new TimerJob({interval: 600000}, function(done) {
<<<<<<< HEAD
  
  processGoogleNews();
=======
  console.log(new Date());
>>>>>>> 3d6f6d85ffc4e6ef56c171d32a185469b1a29def
  done();
});

console.log(new Date());
<<<<<<< HEAD
someTimer.start();

processGoogleNews();
=======
someTimer.start();
>>>>>>> 3d6f6d85ffc4e6ef56c171d32a185469b1a29def
