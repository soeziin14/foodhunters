var express             = require('express'),
    mongoose            = require('mongoose'),
    flash               = require('connect-flash'),
    methodOverride      = require('method-override'),
    cors                = require('cors'),
    bodyParser          = require('body-parser');

var index               = require('./api/routes/index'),
    blog                = require('./api/routes/blog'),
    restaurant          = require('./api/routes/restaurant');

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

app.use(require("express-session")({
    secret: "What can this secret be?",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next) {
    req.headers["Authorization"] = "authorization";
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Request-Headers", "authorization");
    next();
});


//app.use(function(req, res, next){
//    res.locals.currentUser = req.user;
//    res.locals.error = req.flash("error");
//    res.locals.success = req.flash("success");
//    next();
//});

//Routes to pages
app.use('/', index);
app.use('/blog', blog);
app.use('/restaurant', restaurant);

module.exports = app;
