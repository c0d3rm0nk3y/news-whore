// server.js

// BASE setup..

// Call the packages we need..
var Boilerpipe  = require('boilerpipe');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var fs          = require('fs');
var URI         = require('uri-js');
var querystring = require('querystring');


var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);

mongoose.connection.on('connected', function () { console.log('connection successful..');   });
mongoose.connection.on('error', function(err)   { console.log('connection error: %s', err); return;});

console.log('connected to mongodb..');

var News        = require('./app/models/news');

// here we can set the timer function..
getGoogleNews = function() {
  try {
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=100&hl=en&topic=w&output=rss", function(err, articles) {
      if(err)  { console.log(err); }
      else {
        console.log('getGoogleNews(): found %d articles\n\n', articles.length);
        
        for(var i=0; i<articles.length; i++) {
          //processArticle(articles[i]);
          var components = URI.parse(articles[i].link);
          var query = querystring.parse(components.query);
          console.log('%s\n\n', query.url );
        }
      }
  });
  } catch(ex) { console.log(ex); }
}

processArticle = function(article) {
  //console.log('processArticle()..');
  try {
    // test to see if link is in database..
    // strip out url from google news ul..
    
    var deferred = q.defer();
    
    var query = News.findOne({'link' : article.link});
    
    query.exec(function(err, result) {
      //console.log('not in DB, adding "%s"', article.title);
      parseArticle(article);
//       console.log("\terror: %s", err);
//       console.log("\tresult: %s", JSON.stringify(result, null, 2));
      if(err === null && result === null) { // add to db
        deferred.resolve();
      } else { // ignore
        
      }
    });
    return deferred.promise;
  } catch(ex) { console.log('processArticle() ex: ' + ex); }
}

parseArticle = function(article) {
  try {
    read(article.link, function(err, art, meta) {
      //console.log('"%s"\n\tErr: %s\n\tArt: %s', article.title, err, art);
      if(err) { console.log('Error detected!! %s\n\n', article.link); return; }
      if(art !== undefined) { 
        console.log('Found! %s\n\n', article.link);
        // add to db..
        
        // The main body of the page.
       
        
//        var fName = "/tmp/" + art.title + ".html";
//         fs.writeFile(fName, art.html, function(err) {
//           if(err) {
//                 console.log(err);} 
//           else {}
//         });
        // The title of the page.
        //console.log(art.title);

        // The raw HTML code of the page
        //console.log(art.html);

        // The document object of the page
        //console.log(art.document);

        // The response object from request lib

        //console.log(meta);
      }
    });
  } catch(ex) { console.log('parseArticle().. exception detected!!\n\n');} 
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

var timer = setTimeout(function() {
  console.log('timer fired..');
  getGoogleNews();
}, 5000);
