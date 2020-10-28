// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express(); // initializing  express
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient //talk to db
var mongoose = require('mongoose'); // same as mongodb^, different way, mongodb isnt used in this file
var passport = require('passport');// authentication
var flash    = require('connect-flash'); // show err to user

var morgan       = require('morgan'); // debugger, logs, everything will show up in the console
var cookieParser = require('cookie-parser');// keep open connections on the computer
var bodyParser   = require('body-parser'); //access form data
var session      = require('express-session'); // session keeps us logged in.

var configDB = require('./config/database.js');// receiving an obj;

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);// function call, app routs js is the function, passing in app passport & db as args
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration /// fancy way of runing function

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport // allows users to be logged in accross multiple pages
app.use(session({ //
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
