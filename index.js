var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Blog = require("./models/blogs");
var Comment = require("./models/comments");
var User = require("./models/user");
// var path = require('path');


// using dotenv module for environment
require("dotenv").config();

var commentRoutes = require("./routes/comments");
var blogRoutes = require("./routes/blogs");
var authRoutes = require("./routes/user");

mongoose.connect(process.env.MONGODB_URL,{
	useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(()=>console.log('Connected to mongo server'))
	.catch(err => console.error(err));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//seedDB(); //seed the database
//passport configuration
app.use(require("express-session")({
    secret: "anything i want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
});

app.use(commentRoutes);
app.use(blogRoutes);
app.use(authRoutes);


app.listen(3000, function(req,res){
    console.log("Blog World server started");
});
