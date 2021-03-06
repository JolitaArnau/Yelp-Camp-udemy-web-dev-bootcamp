var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/index");


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Some secret, that I am not telling you, cause its a secret. Funny joke, huh?",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// makes the currently logged in user available to each and every template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, function () {
    console.log('Up and running!')
});