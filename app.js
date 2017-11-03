var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
/*Campground.create(
    {
 name: "Granite Hill",
 image: "http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg",
 description: "Beautiful and peaceful place. No internet connection, city hustle and bustle. Just pure wildness."
    }, function (err, campground) {
        if(err) {
            console.log(err);
        } else {
            console.log(campground);
        }
    }
);*/

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });

});

app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });

});

app.listen(3000, function () {
    console.log('Up and running!')
});