var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
	res.render("landing");
});



router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
   req.body.username
	req.body.password
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
	if(err)
	{
			req.flash("error" ,err.message);
				return res.render("register");
		}
	passport.authenticate("local")(req,res,function(){
		  req.flash("success" , "welcome to Yelpcamp " + user.username);
			res.redirect("/campground");
		});
	});
});

router.get("/login",function(req,res){
	res.render("login");
})
router.post("/login",passport.authenticate("local",{
		successRedirect:"/campground",
		failureRedirect:"/login"
}),function(req,res){});
router.get("/logout",function(req,res)
	   {
	req.logout();
	req.flash("success","You logged out successfully !");
	res.redirect("/campground");
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		{
			return next();
		}
	else{
		res.redirect("/login");
	}
}

module.exports=router;		