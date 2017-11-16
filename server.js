const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const ejs = require('ejs');

//mongoDB connection
const configDB = require("./config/database.js");
mongoose.connect(configDB.url, {
  useMongoClient: true
}); // connect to our database

//Get the default connection
const authDB = mongoose.connection;

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(methodOverride("_method"));

// Parse application
app.use(bodyParser.urlencoded({ extended: false }));

//register a Handlebars view engine
//app.engine("handlebars", exphbs({ defaultLayout: "main" }));
//app.set("view engine", "handlebars");

app.set('view engine', 'ejs'); // temporary templating

// required for passport
app.use(session({ secret: "ilovescotchscotchyscotchscotch" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(PORT, function() {
  console.log("listenning on http://localhost:" + PORT);
});
