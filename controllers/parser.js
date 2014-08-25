var read = require('node-readability');
var News        = require('../app/models/news');
var mongoose    = require('mongoose');
var dbUri       = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';
var q           = require('q');


exports.addArticle = function(req, res) {
  // 1. if in db return article..
  mongoose.connect(dbUri);
  mongoose.connection.on('connected', function ()   { console.log('connection successful..');   });
  mongoose.connection.on('error',     function(err) { console.log('connection error: %s', err); return;});
  
};

read(url, function(err, article, meta) {
  // The main body of the page.
  console.log(article.content);
  
  // The title of the page.
  //console.log(article.title);

  // The raw HTML code of the page
  //console.log(article.html);
  
  // The document object of the page
  //console.log(article.document);

  // The response object from request lib
  //console.log(meta);
});

function stripHTML(clean) {
//     var clean = sanitizer.sanitize(html, function (str) {
//         return str;
//     });
  // Remove all remaining HTML tags.
  clean = clean.replace(/<(?:.|\n)*?>/gm, "");

  // RegEx to remove needless newlines and whitespace.
  // See: http://stackoverflow.com/questions/816085/removing-redundant-line-breaks-with-regular-expressions
  clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");

  // Return the final string, minus any leading/trailing whitespace.
  return clean.trim();
}