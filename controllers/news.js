var News        = require('../app/models/news');

// creates endpoint for /api/news for POSTS
exports.postNews = function(req, res) {
  res.json({message: 'feature coming soon..'});
};

// creates endpoint for api/news for GET
exports.getNews = function(req, res) {
  News.find(function(err, news) {
    if(err) res.sned(err);
    
    res.json(news);
  });
};

exports.getToday = function(req, res) {
  //todaysnews?p=title+words
  var s = req.query.view;
  console.log('exports.getToday %s', s);
  
  if(s === '') select = 'title published content';
  
  var d = new Date();
  d.setHours(0,0,0,0);
  News.find( { published: {"$gte" :  d} } )
  .select(s)
      .sort('published')
      .exec(function(err, news) { 
        res.json(news);
      } 
  );
};