// BASE setup..


/*
db.your_collection.update({},
                          {$set : {"new_field":1}},
                          {upsert:false,
                          multi:true}) 
                          
db.inventory.update(
   { category: "clothing" },
   {
     $set: { category: "apparel" },
     $currentDate: { lastModified: true }
   },
   { multi: true }
)
*/

// Call the packages we need..
var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var newsController = require('./controllers/news');
var userController = require('./controllers/user');
var port = process.env.PORT || 8080;
var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';

mongoose.connect(dbUri);
mongoose.connection.on('connected', function () { console.log('connection successful..');   });
mongoose.connection.on('error', function(err)   { console.log('connection error: %s', err); return;});

// need to come up with a scrubber routine to cleanup the html entities.. 

// start with adding update to the api.. then loop through and if detecting an entity, work to replace it and update the
// db..

var app         = express();
app.use(bodyParser());

var router= express.Router();

router.use(function(req, res, next) {
  console.log("we've been hit by a ping captain.. something is happening..\n");
  // log each request to the console
	console.log("%s %s" ,req.method, req.url);
  next();
});

app.all('/*', function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

router.route('/news')
  .post(newsController.postNews)
  .get(newsController.getNews);
    
router.route('/news/:news_id')
  .get(newsController.getNew)
  .put(newsController.toggleRead);

router.route('/todaysnews')
  .get(newsController.getToday);

// create endpoint handler for /user
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

app.use('/api', router);

app.listen(port);
console.log('all engines to full bairing ' + port + '.. ENGAGE\n\n');
var d = new Date();
d.setHours(0,0,0,0);
console.log(d);