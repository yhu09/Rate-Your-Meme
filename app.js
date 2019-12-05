const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");

//DB config
const db = require("./config/keys").MongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb Connected..."))
  .catch(err => console.log(err));

/*Adding and finding in db*/

//Rating Schema
var memeRatingSchema = new mongoose.Schema({
  joy: Number,
  sadness: Number,
  disgust: Number,
  contempt: Number,
  anger: Number,
  fear: Number,
  suprise: Number
});

var memeRating = mongoose.model("memeRating", memeRatingSchema);

//Creating an instance from the schema and add to database
// memeRating.create({
//   joy: 0,
//   sadness: 0,
//   disgust: 0,
//   contempt: 0,
//   anger: 0,
//   fear: 0,
//   suprise : 0
// }, function(err, memeRating) {
//   if(err) {
//     console.log("SOMETHING WENT WRONG IN CREATE");
//   } else {
//     console.log("INSTANCE CREATED");
//     console.log(memeRating);
//   }
// });

//find all existing ratings from the database
memeRating.find({}, function(err, ratings) {
  if (err) {
    console.log("SOMETHING WENT WRONG IN FIND");
  } else {
    console.log("ALL RATINGS RETRIVED");
    console.log(ratings);
  }
});

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
