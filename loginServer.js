"use strict"

const port = 51608
const APIrequest = require('request');
require('dotenv').config(); // Load API key from environment variable
const APIkey = process.env.API_KEY;  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key="+APIkey;

const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

const GoogleStrategy = require('passport-google-oauth20');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./FlashCards.db');
var id = '';

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service. 
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const googleLoginData = {
    clientID: process.env.OAUTH_ID,
    clientSecret: process.env.OAUTH_SECRET,
    callbackURL: '/auth/redirect'
};

// Strategy configuration. 
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline. 
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );


// Let's build a server pipeline!

// app is the object that implements the express server
const app = express();

// pipeline stage that just echos url, for debugging
app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request, decrypt and check if 
// session is still going on. 
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']  
}));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session()); 

// Public static files
app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app. 

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other. 
app.get('/auth/redirect',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/redirect");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the 
	// temporary key we got in the request. 
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done" 
	// will come back here to send back the response
	// ...with a cookie in it for the Browser! 
	function (req, res) {
        console.log('Logged in and using cookies!')
        const search_query = `SELECT * FROM flashcards WHERE userID = @0`;
        console.log(id);
        db.get(search_query, id, (err, row) => {
            if (err) {
                console.log('Error:', err);
            }
            // user not in flashcards table
            else if (typeof row == 'undefined') {
                console.log('Going to card creation');
                res.redirect('/user/lango.html');
            }
            else {
                console.log('Going to review');
                res.redirect('/user/review.html');
            }
        })
	});

// static files in /user are only available after login
app.get('/user/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in 
	// serving files that start with /user from here gets them from ./
	express.static('.') 
       ); 

// next, all queries (like translate or store or get...
app.get('/translate', getTranslation );
app.get('/store', storeFlashcard);
app.get('/update', updateFlashcard);
app.get('/flashcards', isAuthenticated, getFlashcards);
app.get('/name', isAuthenticated, (req, res, next) => {
    res.send(req.user.firstName);
});

// finally, not found...applies to everything
app.use( fileNotFound );

// Pipeline is ready. Start listening!  
app.listen(51608, function (){console.log('Listening...');} );


// middleware functions

function translate(str, res) {
    // An object containing the data expressing the query to the
    // translate API. 
    // Below, gets stringified and put into the body of an HTTP PUT request.
    let requestObject = 
        {
      "source": "en",
      "target": "es",
      "q": [
          str
      ]
        }
          
    // The call that makes a request to the API
    // Uses the Node request module, which packs up and sends off
    // an HTTP message containing the request to the API server
  
    APIrequest(
      { // HTTP header stuff
          url: url,
          method: "POST",
          headers: {"content-type": "application/json"},
          // will turn the given object into JSON
          json: requestObject	},
          // callback function for API request
          APIcallback
        );
  
    // callback function, called when data is received from API
    function APIcallback(err, APIresHead, APIresBody) {
      // gets three objects as input
      if ((err) || (APIresHead.statusCode != 200)) {
          // API is not working
          console.log("Got API error");
          console.log(body);
      } else {
          if (APIresHead.error) {
        // API worked but is not giving you data
        console.log(APIresHead.error);
          } else {
            res.json({
              "English" : requestObject.q[0],
              "Spanish" : APIresBody.data.translations[0].translatedText
            });
          }
      }
      } // end callback function
  
  }
  
  function getTranslation(req, res, next) {
      let qObj = req.query;
      console.log(qObj);
      if (qObj.english != undefined) {
        translate(qObj.english, res);
      }
      else {
          next();
      }
  }
  
  // TO DO: add userID field for insertion
function storeFlashcard(req, res, next) {
    let qObj = req.query;
    console.log(qObj);
    if (qObj.english != undefined && qObj.spanish != undefined) {
      const insert_query = `INSERT INTO flashcards 
        (engText, transText, numShown, numCorrect, userID) 
        VALUES(@0, @1, 0, 0, @2)`;
      db.run(insert_query, qObj.english, qObj.spanish, req.user.googleID, (err) => {
          if(err) {
              console.log("Error inserting data", err);
          } else {
              console.log("Data inserted");
          }
      })
      res.send('Flashcard saved');
    }
    else {
      next();
    }
}

function updateFlashcard(req, res, next) {
    let qObj = req.query;
    console.log(qObj);
    const update_query = `UPDATE flashcards
        SET numShown = @0, numCorrect = @1
        WHERE idNum = @2`;
    if (qObj.isCorrect == 'true') {
        db.run(update_query, qObj.shown+1, qObj.correct+1, qObj.id, (err) => {
            if (err) {
                console.log('Error updating data',err);
            }
            else {
                console.log('Shown and correct columns incremented');
            }
        })
    }
    else if (qObj.isCorrect == 'false') {
        db.run(update_query, qObj.shown+1, qObj.correct, qObj.id, (err) => {
            if (err) {
                console.log('Error updating data',err);
            }
            else {
                console.log('Shown column incremented');
            }
        })
    }
    else {
        next();
    }
}

function getFlashcards(req, res, next) {
    const search_query = `SELECT * FROM flashcards WHERE userID = @0`;
    db.all(search_query, req.user.googleID, (err, rows) => {
        if (err) {
            console.log('Error:',err);
        }
        // if db query returns an empty array, user doesn't have flashcards
        else if (rows.length == 0) {
            next();
        }
        else {
            res.send(rows);
        }
    })
}

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
    if (req.user) {
	console.log("Req.session:",req.session);
	console.log("Req.user:",req.user);
	next();
    } else {
	res.redirect('/login.html');  // send response telling
	// Browser to go to login page
    }
}


// function for end of server pipeline
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process. 

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);
    const search_query = `SELECT * FROM users WHERE googleID = @0`;

    db.get(search_query, profile.id, (err, row) => {
        if (err) {
            console.log('Error:', err);
        }
        else if (typeof row == 'undefined') {   // user not in table
            const insert_query = `INSERT INTO users
            (firstName, lastName, googleID) VALUES(@0, @1, @2)`;
            db.run(insert_query, profile.name.givenName, profile.name.familyName, 
            profile.id, (err) => {
                if (err) {
                    console.log('Error:', err);
                }
                else {
                    console.log('Data inserted');
                }
            })
        }
    })

    let dbRowID = profile.id;
    id = dbRowID;
    done(null, dbRowID);
}

// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object.
    const search_query = `SELECT * FROM users WHERE googleID = @0`;
    db.get(search_query, dbRowID, (err, row) => {
        if (err) {
            console.log('Error:',err);
        }
        else {
            let userData = {
                firstName: row.firstName,
                lastName: row.lastName,
                googleID: dbRowID
            };
            done(null, userData);
        }
    })
});
