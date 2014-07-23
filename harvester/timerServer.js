var TimerJob    = require('timer-jobs');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');
var URI         = require('uri-js');
var querystring = require('querystring');

getGoogleNews = function () {
  try {
    
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