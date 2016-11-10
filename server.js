var express             = require('express'),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    InstagramStrategy   = require('passport-instagram').Strategy,
    flash               = require('connect-flash'),
    methodOverride      = require('method-override'),
    bodyParser          = require('body-parser');

var index               = require('./api/routes/index');

var User                = require("./api/models/user"),
    InstagramUser       = require('./api/models/user-oauth'),
    Comment             = require("./api/models/comment"),
    Blog                = require("./api/models/blog");

var app = express();
mongoose.connect("mongodb://localhost:3000/commensalism");
app.set('JSON_CALLBACK', 'callback');
// view engine setup
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(methodOverride("_method"));
app.use(flash());

//Passport configurations
app.use(require("express-session")({
    secret: "What can this secret be?",
    resave: false,
    saveUninitialized: false
}));

//app.use(passport.initialize());
//app.use(passport.session());
//
//passport.serializeUser(function(user, done) {
//    done(null, user);
//});
//
//passport.deserializeUser(function(obj, done) {
//    done(null, obj);
//});
//passport.use(new LocalStrategy(User.authenticate()));
//
//passport.use(new InstagramStrategy({
//
//    clientID:  'e93389cd43464e6cbacc5a414b980f3f',
//    clientSecret: '977a975146c1418d839bb2d540abdd2e',
//    callbackURL: "http://localhost:3000/api/auth/instagram/callback"
//
//}, function(accessToken, refreshToken, profile, done) {
//    console.log("find!!!", accessToken, refreshToken, profile, done);
//    InstagramUser.findOne({ oauthID: profile.id }, function(err, user) {
//        if(err) {
//            console.log("insta find err", err);  // handle errors!
//        }
//        if (!err && user !== null) {
//            done(null, user);
//        } else {console.log("?!?!?!?!");
//            user = new InstagramUser({
//                oauthID: profile.id,
//                name: profile.displayName,
//            });
//            user.save(function(err) {
//                if(err) {
//                    console.log(err);  // handle errors!
//                } else {
//                    console.log("saving user ...", user);
//                    done(null, user);
//                }
//            });
//        }
//    });
//   }
//));



//app.use(function(req, res, next){
//    res.locals.currentUser = req.user;
//    res.locals.error = req.flash("error");
//    res.locals.success = req.flash("success");
//    next();
//});

//Routes to pages
app.use('/', index);

module.exports = app;
