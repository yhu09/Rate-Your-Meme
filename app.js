const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const mongoose = require('mongoose');


//DB config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongodb Connected...'))
  .catch(err => console.log(err)
);

//EJS
app.use(expressLayout);
app.set("view engine", "ejs");

//Serving static files in Express
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

//Routing to home
app.get("/", function(req, res) {
  res.render("home");
});

//Routing to library and about page
app.get("/library", (req, res) => res.render("library"));
app.get("/about", (req, res) => res.render("about"));

//Routing to PageNotFound
app.get("*", function(req, res) {
  res.render("PageNotFound");
});

app.listen(5000, function() {
  console.log("server is running...");
});
