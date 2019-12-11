// copied from https://github.com/tuftsdev/WebProgramming/blob/gh-pages/examples/nodejs/simpleposting/app.js
// modified for Lab 7 by tchang06

var express = require('express');
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
var bodyParser = require('body-parser')
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true })); // Required if we need to use HTTP post parameters

/********    END OF app SETUP    ********/

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/nodemongoexample';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

/********    END OF MongoDB SETUP    ********/

/* GET /passenger.json SECTION */
/******************************************************************************/

app.get('/passenger.json', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    if (typeof req.query.username !== 'undefined') {
        //possibly a valid username-- look for records of
        //  username in MongoDB collection passengers, return ALL found
        db.collection('passengers', function(er, collection) {
            collection.find().toArray(function(err, results) {
                if (!err) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].username != req.query.username) {
                            results.splice(i--, 1);
                        }
                    }
                    console.log(results);
                    res.send(JSON.stringify(results));
                } else {
                    res.send("Database error!");
                }
            });
        });

    } else {
        //If the username query parameter is
        //  empty, not provided, or no results found
        res.send("[]");
    }
});

/* GET / (Home) SECTION */
/******************************************************************************/

/* Need to implement: Returning HTML, getting the actual data */
app.get('/', function(req, res) {
    db.collection('vehicles', function(er, collection) {
        collection.find().toArray(function(err, results) {
            if (!err) {
                var HTML_txt = "<!DOCTYPE html> <!--HTML document-->";
                HTML_txt += '<html lang="en">';
                HTML_txt += "<head>";
                HTML_txt += "<title>all the vehicles in the database</title>";
                HTML_txt += '<meta charset="utf-8" />';
                HTML_txt += '</head>';
                HTML_txt += '<body>';

                //sort the list
                results.sort(function(a, b) {
                    return (new Date(b.created_at)) - (new Date(a.created_at));
                });
                //add in all the text
                for (var i = 0; i < results.length; i++) {
                    HTML_txt += '<p>';
                    HTML_txt += results[i].username;
                    HTML_txt += ' was looking for passengers at ';
                    HTML_txt += results[i].lat + ", " + results[i].lng;
                    HTML_txt += ' on ' + results[i].created_at;
                    HTML_txt += '</p>';
                }

                HTML_txt += '</body>';
                HTML_txt += '</html>';
                res.send(HTML_txt);
            } else {
                res.send("Database error!");
            }
        });
    });
});

/* POST /rides SECTION */
/******************************************************************************/

var vehicles = ["JANET","NgfcWZmS", "tNEh59TC", "suFKyeZg", "VMerzMH8", "6tWDkKh6", "ajNnfhJj", "bCxY6mCw", "Cq4NX9eE", "mXfkjrFw", "EMYaM9D8", "nZXB8ZHz", "Tkwu74WC", "TnA763WN", "TaR8XyMe", "5KWpnAJN", "uf5ZrXYw"];

var post_error = {"error":"Whoops, something is wrong with your data!"};

app.post("/rides", function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");

	console.log("Got a request. Body below:");
	console.log(request.body);

    if ((typeof request.body.username !== 'undefined') && (typeof request.body.lat !== 'undefined') && (typeof request.body.lng !== 'undefined')) {
        var toInsert = {
            "username" : request.body.username,
            "lat": parseFloat(request.body.lat),
            "lng": parseFloat(request.body.lng),
            "created_at": new Date().toJSON()
        };
        console.log(request.body.username + ': ' + vehicles.indexOf(request.body.username));
        if (vehicles.indexOf(request.body.username) >= 0) {
            // It is a vehicle.
            console.log("INSERTING INTO VEHICLES");
            //add to vehicles collection
            db.collection('vehicles', function (error, coll) {
                coll.insert(toInsert, function(error, saved) {
                    if(error) {
                        response.send(500);
                    } else {
                        //successful insertion
                    }
                });
            });
            //get passengers list
            var threeMinutesAgo = new Date(new Date().getTime() - 1000 * 60 * 3);

            db.collection('passengers', function(er, collection) {
                collection.find().toArray(function(err, results) {
                    if (!err) {
                        for (var i = 0; i < results.length; i++) {
                            if (new Date(results[i].created_at) < threeMinutesAgo) {
                                results.splice(i--, 1);
                            }
                        }
                        response.send('{"passengers": ' + JSON.stringify(results) + '}');
                    } else {
                        response.send(JSON.stringify(post_error));
                    }
                });
            });

        } else {
            // It is a passenger
            db.collection('passengers', function (error, coll) {
                coll.insert(toInsert, function(error, saved) {
                    if(error) {
                        response.send(500);
                    } else {
                        //successful insertion
                    }
                });
            });
            //get passengers list
            var threeMinutesAgo = new Date(new Date().getTime() - 1000 * 60 * 3);

            db.collection('vehicles', function(er, collection) {
                collection.find().toArray(function(err, results) {
                    if (!err) {
                        for (var i = 0; i < results.length; i++) {
                            if (new Date(results[i].created_at) < threeMinutesAgo) {
                                results.splice(i--, 1);
                            }
                        }
                        response.send('{"vehicles": ' + JSON.stringify(results) + '}');
                    } else {
                        response.send(JSON.stringify(post_error));
                    }
                });
            });

        }
    } else {
        response.send(JSON.stringify(post_error));
    }

});

/******************************************************************************/
/********    ACTIVATE THE app!    ********/
// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 8888);
