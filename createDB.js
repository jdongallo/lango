// Globals
let sqlite3 = require("sqlite3").verbose();  // use sqlite
let fs = require("fs");

let dbFileName = "FlashCards.db"
// makes the object that represents the database in our code
let db = new sqlite3.Database(dbFileName);

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming PhotoQ.db
let cmdStr = `CREATE TABLE flashcards (
	idNum INTEGER PRIMARY KEY AUTOINCREMENT, 
	engText TEXT,
	transText TEXT,
	numShown INTEGER,
	numCorrect INTEGER,
	userID TEXT
	)`;
db.run(cmdStr,tableCreationCallback);
cmdStr = `CREATE TABLE users (
	firstName TEXT,
	lastName TEXT,
	googleID TEXT
	)`;
db.run(cmdStr,tableCreationCallback);

// Always use the callback for database operations and print out any
// error messages you get.
function tableCreationCallback(err) {
    if (err) {
		console.log("Table creation error",err);
    } else {
		console.log("Database created");
		db.close();
    }
}
