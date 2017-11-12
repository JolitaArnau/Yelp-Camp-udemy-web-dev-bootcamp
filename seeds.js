var mongoose     = require("mongoose");
var Campground   = require("./models/campground");
var Comment      = require("./models/comment");

var data = [
    {
    name: "Snow White",
    image: "http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg",
    description: "Wonderful nights out here!"
    },
    {
        name: "Fort Casey",
        image: "https://www.campsitephotos.com/photo/camp/44948/Fort_Casey_002.jpg",
        description: "For everyone who enjoys lakes!"
    },
    {
        name: "Idaho Camground",
        image: "http://cdn.blog.rvshare.com/wp-content/uploads/2015/05/idaho-campgrounds-sli.jpg",
        description: "Perfect for families!"
    }

    ];

function seedDB() {
    Campground.remove({}, function (err) {
        console.log("removed everything");
        data.forEach(function(seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    // create comment
                    Comment.create(
                        {
                            text: "This place is awsome but I wish there was internet",
                            author: "John"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment");
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;

