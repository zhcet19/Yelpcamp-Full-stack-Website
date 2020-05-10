var middlewareObj={}
var Campground=require("../models/campgrounds");
var Comment= require("../models/comment");

middlewareObj.checkOwnership=function(req,res,next){
if(req.isAuthenticated())
	{ Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
		   req.flash("error" , "Campground not found");
           res.redirect("back");
	   }else{
		      if(foundCampground.author.id.equals(req.user._id))
				  {
					  next();
				  }
		   else{
			   req.flash("error" , "You don't have permission to do that");
			   res.redirect("back");
		   }
	   }
	});}
	 else{
		 res.redirect("back");
	 }}

middlewareObj.checkCommentOwner=function(req,res,next){
if(req.isAuthenticated())
	{ Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
	   }else{
		      if(foundComment.author.id.equals(req.user._id))
				  {
					  next();
				  }
		   else{
			   req.flash("error" , "You don't have permission to do that");
			   res.redirect("back");
		   }
	   }
	});}
	 else{
		 req.flash("error" , "You need to be logged in first to do that");
		 res.redirect("back");
	 }}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated())
		{
			return next();
		}
	else{
		req.flash("error" , "You need to be logged in first to do so..");
		res.redirect("/login");
	}
}

module.exports= middlewareObj;