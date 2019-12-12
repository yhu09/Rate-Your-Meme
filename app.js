const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
mongoose.set('useFindAndModify', false);

//DB config
const db = require("./config/keys").MongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongodb Connected..."))
  .catch(err => console.log(err));

/*Adding and finding in db*/

//Rating Schema
var memeRatingSchema = new mongoose.Schema({
  meme: String,
  joy: Number,
  sadness: Number,
  disgust: Number,
  anger: Number,
  fear: Number,
  surprise: Number
});

var memeRating = mongoose.model("memeRating", memeRatingSchema);

//Creating an instance from the schema and add to database
// memeRating.create({
//   meme: 25,
//   joy: 0,
//   sadness: 0,
//   disgust: 0,
//   anger: 0,
//   fear: 0,
//   surprise : 0,
//   views: 0
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

app.listen(process.env.PORT || 5000, function() {
  console.log("server is running...");
});

// parsing json
app.use(bodyParser.json());

// app.put("/rate", async (request, response) => {
//   // try {
//     var ratings = request.body;
//     console.log("new data:")
//     console.log(ratings);
//     console.log(ratings.meme);
//     var memenumber = ratings.meme;
//     memeRating.findOneAndUpdate(ratings.meme, ratings);
//     // var result = await ratings.save();
//     console.log("sending rating:");
//     // console.log(result);
//     console.log("sent");
//     response.send(ratings);
//   // } catch (error) {
//     // console.log("error rating");
//     // response.status(500).send(error);
//   // }
// });

app.get("/meme", (req, res) => {
  console.log("getting");
  memeRating.find(req.query, function(err, ratings) {
    if (err) {
      console.log("SOMETHING WENT WRONG IN FIND");
    } else {
      res.send(ratings);
      console.log(ratings);
    }
  });
});

app.put("/rate", async (req, res) => {
  filter = { meme : req.body.meme };
  var ratings = await memeRating.findOneAndUpdate(filter, req.body);
  res.send(ratings);
});

//Routing to PageNotFound
app.get("*", function(req, res) {
  res.render("PageNotFound");
});
