var News        = require('../app/models/news');
var read        = require('node-readability');
var q           = require('q');
var fs          = require('fs');

// creates endpoint for /api/news for POSTS
exports.postNews = function(req, res) {
  //res.json({message: 'feature coming soon..'});
  // search DB..
  //console.log(req.body.link);
  //console.log(req);
  
  processPost(req.body.link).then(function(result) {
    
    res.json({message: 'added', data: result});
    console.log(result);
    //res.json({message : 'found..', data: result});
  }, function(err) {
    console.log('processPost err..');
    res.json(err);
  });
  
};

processPost = function(link) {
  var d = q.defer();
  
  try {  
    isInDB(link).then(function(result) {
      if(result) {
        News.findOne({'link': link}, 'title words', function(err, article) {
          if(err) { console.log('err: %s', err); }
          
          d.resolve(article);
        });
      } else { // not in db..
        readabilify(link).then(
          function(result) {  d.resolve(result); }, 
          function(err) {  d.reject(err); });
      }
    });  
  } catch(e) { console.log('processPost ex: %s', e); }
  
  return d.promise;
}

readabilify = function(link) {
  try {
    var d = q.defer();
    console.log(link);
    read(link, function(err, art, meta) { 
      if(art !== null && art !== undefined && err === null) {
        var news = new News();
        news.title = art.title;
        news.html = art.html
        news.document = art.document;
        news.content = stripHTML(art.content);
        news.words = getWords(art.content);
        d.resolve(news);
      } else { d.reject(err); }
    });
    
    return d.promise;
  } catch(ex) { console.log('readabilify() ex: %s', ex); }
}



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

exports.toggleRead = function(req, res) {
  News.findById(req.params.news_id, function(err, news) {
    if(err) res.send(err);
    
    news.isRead = !news.isRead;
    
    news.save(function(err) {
      if(err) res.json(err);
      
      res.json({message: "toggled successfully"}); 
    });
    // figure out what to update.
  });
};

exports.deleteNews = function(req, res) {
  News.findByIdAndRemove(req.params.news_id, function(err) {
    if(err) res.send(err);
    
    res.json({message: "article removed"});
  });
};

exports.getToday = function(req, res) {
  //todaysnews?view=title+words
  var s = req.query.view;
  var c = req.query.count;
  console.log('count: %s', c);
  console.log('exports.getToday %s', s);
  if(c === '') c = 100;
  if(s === '') select = 'title published content submitted';
  
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

isInDB = function(link) {
  //console.log('isInDB()..');
  try {

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