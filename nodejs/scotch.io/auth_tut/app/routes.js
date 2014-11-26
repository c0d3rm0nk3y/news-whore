var read        = require('node-readability');
var request     = require('request');
var q           = require('q');
var User     		= require('../app/models/user');

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
  
  app.get('/submitArticle', function(req, res) {
    console.log('submitArticle\nlink: %s\ntoken: %s', req.query.link, req.query.token);
    //res.json({message: 'feature coming soon..'});
    // https://www.googleapis.com/oauth2/v1/tokeninfo
    
    checkandverify(req.query).then(
      function(result) {
        console.log(result);
        res.json(result);
      },
      function(err) {
        console.log(err);
        res.json(err);
      }
    );
    
    // might need to move the whole bloody mess into a promise and have it returned here for posting.. i'm guessing
    // waiting will not work..

    // just a theory...    a game theory..
//     request.post(
//       'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + req.query.token,
//       {},
//       function(error, response, body) {               
//         if(!error && response.statusCode == 200) {
//           var r = JSON.parse(body);
          
//           User.findOneAndUpdate(
//             {'google.id' : r.user_id},
//             {$push: { "links" : req.query.link}},
//             { safe: true, upsert: true},
//             function(err, user) {
//               if(err) console.log(err);
//               // get readify 
//               readabilify(req.query.link).then(
//                 function(result) {
//                   console.log('readabilify returned successful:\n' + result);
//                   res.json(result);
//                 },
//                 function(err) {
//                   console.log('readabilify failed:\n' + err);
//                   res.json({err :err});
//                 }
//               );
              
//             }
//           );
//         }
//       }
//     );
  });
  
  authUser = function(token) {
    console.log('authUser()..');
    var d = q.defer();
    try {
      request.post(
      'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token,
      {},
      function(error, response, body) {
        console.log()
        if(!error && response.statusCode == 200) {
          d.resolve(true);  
        } else {
          d.resolve(false);
        }
      });
    }catch(ex) {
      d.reject(ex);
    }
  }
  
  checkandverify = function(query) {
    console.log('check and verify()..');
    var d = q.defer();
    var token = query.token;
    var link = query.link;
    try {
      authUser(token).then(
        function(isAuth) {
          if(isAuth) { // user is registered.. 
            readability(link).then(
              function(result) {
                d.resolve(result);
              },
              function(err) {
                d.reject(err);
              }
            );
          } else { // user is not registered 
            d.resolve({ message: "not a registered user.."})
          }
        },
        function(err) {
          d.reject(err);
        }
      );     
    } catch(ex) {
      d.reject(ex);
    }
  }

  readabilify = function(link) {
  try {
    console.log('readabilify()...');
    var d = q.defer();
    console.log(link);
    read(link, function(err, art, meta) { 
      if(art !== null && art !== undefined && err === null) {
        console.log('link found:\n' + art);
        // maybe save it here?!
        d.resolve(art);
      } else { d.reject(err); }
    });
    
    return d.promise;
  } catch(ex) { console.log('readabilify() ex: %s', ex); }
}
  
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
  
	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
	// send to google to do the authentication
	// profile gets us their basic information including their name
	// email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure 
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}