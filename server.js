// server.js

// BASE setup..

// Call the packages we need..
var Boilerpipe  = require('boilerpipe');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var fs          = require('fs');


var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);

mongoose.connection.on('connected', function () { console.log('connection successful..');   });
mongoose.connection.on('error', function(err)   { console.log('connection error: %s', err); });

console.log('connected to mongodb..');

var News        = require('./app/models/news');


// here we can set the timer function..
getTopTen = function() {
  try {
    feed("https://news.google.com/news/feeds?pz=1&cf=i&ned=us&num=100&hl=en&topic=w&output=rss", function(err, articles) {
      if(err)  { console.log(err); }
      else {
        console.log('getTopTen(): found %d articles', articles.length);
        // loop through each article
        for(var i=0; i<articles.length; i++) {
          processArticle(articles[i]);
        }
        console.log('GoogleNews reqeust fullfilled..');
      }
  });
  } catch(ex) { console.log(ex); }
}

processArticle = function(article) {
  console.log('processArticle()..');
  try {
    // test to see if link is in database..
    var query = News.findOne({'link' : article.link});
    query.exec(function(err, news) {
      console.log('err: %s', err);
      console.log('news %s', news);
//       if(err) { // not found
//         console.log('article "%s" not found, off to parsing', article.title);
//         parseArticle(article);
//       } else { // found
//         console.log('article %s found..', news);
//       }
    });
  } catch(ex) { console.log('processArticle() ex: ' + ex); }
}

parseArticle = function(article) {
  console.log('parseArticle()..');
  try {
    read(article.link, function(err, art, meta) {
      if(err) {console.log('parseArticle.read() err: %s', err); } else {
        
        // The main body of the page.
        console.log(stripHTML(art.content));
        
        var fName = "/tmp/" + art.title + ".html";
        fs.writeFile(fName, art.html, function(err) {
          if(err) {
                console.log(err);} 
          else {}
        });
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
  } catch(ex) { console.log('parseArticle().. ex: %s', ex);} 
}

function stripHTML(clean) {
  // Remove all remaining HTML tags.
  clean = clean.replace(/<(?:.|\n)*?>/gm, "");

  // RegEx to remove needless newlines and whitespace.
  // See: http://stackoverflow.com/questions/816085/removing-redundant-line-breaks-with-regular-expressions
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");

  // Return the final string, minus any leading/trailing whitespace.
  return clean.trim();
}

var timer = setTimeout(function() {
  console.log('timer fired..');
  getTopTen();
}, 5000);
