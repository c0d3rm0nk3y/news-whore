// app/models/news.js

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var NewsSchema    = new Schema({
  title       : String,
  author      : String,
  link        : String,
  content     : String,
  html        : String,
  isRead      : { type: Boolean, default : false },
  published   : Date,
  document    : String,
  words       :  [],
  feed        :  {
    name    : String,
    source  : String,
    link    : String
  }
});

module.exports = mongoose.model('News', NewsSchema);
