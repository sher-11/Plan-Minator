var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars");
var config = require("./config/config");
var session = require("express-session");
const MongoStore = require('connect-mongo')(session)
var path = require("path");
var app = express();

mongoose.connect(config.database, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
	}
});

app.use(express.static(__dirname + "/public"));

app.engine(
	"handlebars",
	handlebars({
		helpers: {
			json: function (context) {
				return JSON.stringify(context);
			},
		},
	})
);

app.set("view engine", "handlebars");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			ttl: 60 * 60
		})

	}),
);

app.use(require("./routes/index"));

app.listen(3000, function (err) {
	if (err) throw err;
	console.log("Server is Running");
});
