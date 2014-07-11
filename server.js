// server.js

// BASE setup..

// Call the packages we need..
var Boilerpipe  = require('boilerpipe');
var read        = require('node-readability');
var q           = require('q');
var feed        = require('feed-read');
var mongoose    = require('mongoose');


var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

//mongoose.connect(dbUri);

console.log('connected to mongodb..');

var News        = require('./app/models/news');


// here we can set the timer function..


var timer = setInterval(function() {
  console.log('timer fired..');  
}, 5000);