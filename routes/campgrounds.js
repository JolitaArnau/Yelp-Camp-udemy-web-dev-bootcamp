var express = require("express");
var router  = express.Router();

var Campground = require("../models/campground");
// INDEX PAGE - show all campgrounds
router.get("/campgrounds", function(req, res) {
    console.log(req.user);
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
router.post("/campgrounds", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function (err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Render template for creating a new campground
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
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

// middlewear
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
