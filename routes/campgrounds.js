var express=require("express");
var router=express.Router();
var mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
var geocodingClient= mbxGeocoding({accessToken:'pk.eyJ1IjoiZmFpemFtdSIsImEiOiJjazllMmo2M20wMWMyM21zMzdua2pyYzg5In0._-xqv7iPoQ8a52C9eijdIw'});
var Campground= require("../models/campgrounds");
var middleware= require("../middleware/index.js");

 //INDEX - show all campgrounds
router.get("/campground", function(req, res){
    
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({$or:[{name:regex},{location:regex},{"author.username":regex}]}, function(err, allCampgrounds){
		
           if(err||!allCampgrounds.length){
               req.flash('error', 'No campgrounds matched your search. Please try again.');
               res.redirect("back");
           } else {
              res.render("campgrounds/index",{campground:allCampgrounds,page:'campgrounds'});
           }
        });
    }
	else
		{
			Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campground:allCampgrounds,currentUser:req.user});
           }
        });
		}
});

	router.post("/campground",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var price=req.body.price;	
	var image=req.body.image;
	var desc=req.body.description;	
	var author={
		id: req.user._id,
		username: req.user.username
	};
	var location=req.body.location;		
async function geocoder(location){
	try{
		let response =await geocodingClient.forwardGeocode({
	    query:req.body.location,
	    limit:1
})
.send()
		console.log(response.body.features[0].geometry.coordinates)
}catch(err){
	console.log(err);
}}
var coordinates= req.body.coordinates;		
req.body.coordinates=geocoder(req.body.location);
	
	
var newCampground={name: name,price:price,image:image,description:desc,author:author,location:location,coordinates:coordinates}
Campground.create(newCampground,function(err,newlyCreated)
					 {
		if(err)
			{
				console.log(err);
			}
		else
			{  
				res.redirect("/campground");
			}
	});
	});
	

	
router.get("/campground/new",middleware.isLoggedIn,function(req,res){
	   res.render("campgrounds/new");
});
router.get("/campground/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
						{
		if(err)
			{
				console.log(err);
			}
		else
	{  
		
		console.log(foundCampground)
		res.render("campgrounds/show",{campground:foundCampground});
	}

	});
});
router.get("/campground/:id/edit",middleware.checkOwnership,function(req,res){

   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           res.redirect("/campground");
       } else {
           res.render("campgrounds/edit", {campground: foundCampground});
       }
    });
	
});
router.put("/campground/:id",middleware.checkOwnership,function(req, res){
	
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
          res.redirect("/campground");
      }  else {
          res.redirect("/campground/"+ req.params.id);
      }
   });
});
router.delete("/campground/:id",middleware.checkOwnership,function(req, res){
  
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campground");
       } else {
           res.redirect("/campground");
       }
   })
 
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;




	


