require('dotenv').config();
var express=require("express");

var app=express();
var request= require("request");
var bodyparser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose=require("mongoose");
var flash= require("connect-flash");
var LocalStrategy= require("passport-local")
var passport= require("passport");

var passportLocalMongoose= require("passport-local-mongoose");
var methodOverride = require("method-override");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
var Campground =require("./models/campgrounds"); 
var seedDB = require("./seeds");
var Comment = require("./models/comment");

var User= require("./models/user")
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public"));
//seedDB();
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

app.use(require("express-session")(
	{
		secret:"i am faiz alam",
		resave:false,
		saveUninitialized:false
	}
		
));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

	
app.listen(3000,function()
		  {
	console.log("server is listening");
});		
		
		
		
		
		
		
		
		

