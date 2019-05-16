"use strict"

const APIrequest = require('request');
const http = require('http');

require('dotenv').config(); // Load API key from environment variable
const APIkey = process.env.API_KEY;  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key="+APIkey;

const express = require('express')
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
        // const select_query = `SELECT * FROM flashcards`;
        // db.run(select_query, (err, data) => {
        //   if(err) {
        //       console.log(err);
        //   } else {
        //       console.log(data);
        //   }
        //     })
        }
      })
    res.send('Flashcard saved');
  }
  else {
    next();
  }
}

function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

// put together the server pipeline
const app = express()
app.use(express.static('public'));  // can I find a static file? 
app.get('/translate', queryHandler );   // if not, is it a valid query?
app.get('/store', storeFlashcard);
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )
 
