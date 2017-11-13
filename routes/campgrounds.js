var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");

// INDEX PAGE - show all campgrounds
router.get("/campgrounds", function(req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// Create new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function (err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Render template for creating a new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Find campground by Id and display detailed info about that campground
router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

});

// Render template for editing a campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnerShip, function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

// Update the previously edited campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnerShip, function (req, res) {
   // find and update the correct cmpground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, upatedCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnerShip, function (req, res) {
   Campground.findByIdAndRemove(req.params.id, function (err) {
       if (err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;
