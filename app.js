const express = require("express");
const app = express();
const expressLayout = require('express-ejs-layouts');

app.use(expressLayout);
app.set('view engine', 'ejs');


app.use( express.static( "public" ) );
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("home");
});

app.get('/login', (req, res) => res.render('login'));

app.get('/register', (req, res) => res.render('register'));

app.get("*", function(req, res){
  res.render("PageNotFound");
})

app.listen(5000, function() {
	console.log("server is running...")
});
