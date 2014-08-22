var News        = require('../app/models/news');

// creates endpoint for /api/news for POSTS
exports.postNews = function(req, res) {
  res.json({message: 'feature coming soon..'});
  var news = new News();
  // need to come up with module to do the parsing and add to DB.
};

// creates endpoint for api/news for GET
exports.getNews = function(req, res) {
  News.find(function(err, news) {
    if(err) res.sned(err);
    
    res.json(news);
  });
};

// create endpoint for /api/news/:news_id
exports.getNew = function(req, res) {
  News.findById(req.params.news_id, function(err, news) {
    if(err) { res.send(err); }
    
    res.json(news);
  });
};

exports.putNew = function(req, res) {
  
};

exports.getToday = function(req, res) {
  //todaysnews?view=title+words
  var s = req.query.view;
  var c = req.query.count;
  console.log('count: %s', c);
  console.log('exports.getToday %s', s);
  if(c === '') c = 100;
  if(s === '') select = 'title published content';
  
  var d = new Date();
  d.setHours(0,0,0,0);
  News
  .find( { published: {"$gte" :  d} } )
  .limit(c)
  .select(s)
      .sort('published')
      .exec(function(err, news) { 
        res.json(news);
      } 
  );
};