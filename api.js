// BASE setup..

// Call the packages we need..
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var dbUri = 'mongodb://datawhore:badCodeMonkey01!@ds027799.mongolab.com:27799/news';
process.setMaxListeners(0);
mongoose.connect(dbUri);

mongoose.connection.on('connected', function () { console.log('connection successful..');   });
mongoose.connection.on('error', function(err)   { console.log('connection error: %s', err); return;});

console.log('connected to mongodb..');

var News        = require('./app/models/news');

app.use(bodyParser());

var port = process.env.PORT || 8080;
var router= express.Router();

router.use(function(req, res, next) {
  console.log("we've been hit by a ping captain.. something is happening..\n");
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

// test root of the route..
router.get('/', function(req, res) {
  // this could a site to host.. maybe even the beta ground for a web app
  res.json({message: "we're hailing them sir, but all we get back is right-wing conservative propoganda.."});
});

// routes that end in /news
router.route('/news')
.post(function(req, res) { res.json({response: "not ready at this time..."}); })
.get(function(req, res) {
  try {
    News.find().select('title words').exec(function(err, news) {
      res.json(news);
    });
    //res.json({response: "get news.."});
  } catch(ex) { console.log('/news'); }
});

app.use('/api', router);
// start the server..
app.listen(port);
console.log('all engines to full bairing ' + port + '.. ENGAGE\n\n');