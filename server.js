var express             = require('express'),
    mongoose            = require('mongoose'),
    flash               = require('connect-flash'),
    methodOverride      = require('method-override'),
    cors                = require('cors'),
    bodyParser          = require('body-parser');

var index               = require('./api/routes/index');

var app = express();
mongoose.connect("mongodb://localhost:3000/commensalism");
// view engine setup
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cors());

//Passport configurations
app.use(require("express-session")({
    secret: "What can this secret be?",
    resave: false,
    saveUninitialized: false
}));


//app.use(function(req, res, next){
//    res.locals.currentUser = req.user;
//    res.locals.error = req.flash("error");
//    res.locals.success = req.flash("success");
//    next();
//});

//Routes to pages
app.use('/', index);

module.exports = app;
