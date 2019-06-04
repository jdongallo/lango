"use strict"

const APIrequest = require('request');
const http = require('http');

require('dotenv').config(); // Load API key from environment variable
const APIkey = process.env.API_KEY;  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key="+APIkey;

const express = require('express')
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');
const googleLoginData = {
  clientID: '138709797891-8bume5l3juvqgeubldqfet7b6o4ap2vp.apps.googleusercontent.com',
  clientSecret: 'OlZ7-NqURz_fBMwhG6qSdQ0Z',
  callbackURL: '/auth/redirect'
};

// Sets up passport authentication strategy
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );
const port = 51608

let sqlite3 = require("sqlite3").verbose();  // use sqlite
let fs = require("fs");
const db = new sqlite3.Database('./FlashCards.db');

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

function queryHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if (qObj.english != undefined) {
      translate(qObj.english, res);
    }
    else {
	    next();
    }
}

function storeFlashcard(req, res, next) {
  let url = req.url;
  let qObj = req.query;
  console.log(qObj);
  if (qObj.english != undefined && qObj.spanish != undefined) {
    const insert_query = `INSERT INTO flashcards 
      (engText, transText, numShown, numCorrect) 
      VALUES(@0, @1, 0, 0)`;
    db.run(insert_query, qObj.english, qObj.spanish, (err) => {
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

function isAuthenticated(req, res, next) {
    if (req.user) {
        console.log('Req.session: ',req.session);
        console.log('Req.user',req.user);
    }
    else {
        res.redirect('/login.html');
    }
}

function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile:",profile);
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
    done(null, dbRowID);
}

passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: dbRowID};
    done(null, userData);
});

function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// put together the server pipeline
const app = express()
app.get('*', express.static('public'))
// pipeline stage that just echos url, for debugging
app.use('/', printURL);
app.use(cookieSession({
  maxAge: 2 * 60 * 1000, // Six hours in milliseconds
  // meaningless random string used by encryption
  keys: ['hanger waldo mercy dance']  
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));  // can I find a static file?

app.get('/auth/google', // redirect browser to Google for login
  passport.authenticate('google', {scope: ['profile']} ));
app.get('/auth/redirect',
    // for educational purposes
	function (req, res, next) {
    console.log("at auth/redirect");
    next();
  },
  passport.authenticate('google'),
  function (req, res) {
    console.log('Logged in and using cookies!')
    res.redirect('/user/lango.html');
});
app.get('/user/*', isAuthenticated, express.static('.'));   // serves files if logged in

app.get('/translate', queryHandler );   // if not, is it a valid query?
app.get('/store', storeFlashcard);
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )
 
