var passport            = require('passport'),
    jwt                 = require('jsonwebtoken'),
    InstagramUser       = require('../models/user-oauth'),
    User                = require('../models/user');

module.exports.signup = function(req, res){
    console.log('registering new user...');

    var email           = req.body.email,
        firstname       = req.body.firstname,
        lastname        = req.body.lastname,
        password        = req.body.password,
        username        = req.body.username,
        address         = req.body.address || null;

    var newUser = new User({
        email       :  email,
        firstName   :  firstname,
        lastName    :  lastname,
        username    :  username,
        address     :  address
    });

    User.register(newUser, password, function(err, user){
        if (err) {
            console.log(err, newUser);
            res.status(400).json(err);
        } else {
            console.log('user created', user);
            passport.authenticate("local")(req, res, function(){
                console.log(user.username + ' authenticated.');
            });
            res.status(201).json({success: true});
        }
    });
};

module.exports.signin = function(req, res, next){
    console.log('Logging in...');

    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var msg = "Wrong credentials entered.";
            res.send({wrongCredentials: msg});
        } else {
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                var token = jwt.sign({username: user.username, id: user._id}, 's3cr3t', {expiresIn: 3600 });
                res.status(200).json({success: true, token: token});
            });
        }
    })(req, res, next);
};

module.exports.signout = function(req, res, next) {
    console.log('logging out...');
    req.logout();
    res.status(200).json({success: true});
};

module.exports.getUser = function(req, res, next) {
    console.log("getting user...", req.params.userId);

    User.findById(req.params.userId).populate("comments").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            console.log(foundUser);
            //render show template with that campground
            res.status(200).json({success: true, user: foundUser});
        }
    });
};

module.exports.getInstagramUser = function(req, res, next) {
    console.log("getting Instagram user...", req.body, res);

    passport.authenticate("instagram", function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var msg = "Wrong credentials entered.";
            res.send({wrongCredentials: msg});
        } else {
                var token = jwt.sign({username: user.username, id: user._id}, 's3cr3t', {expiresIn: 3600 });
                res.status(200).json({success: true, token: token});
            }
        })(req, res, next);
};

module.exports.getInstagramUserCallback = function(req, res, next) {
    console.log("Instagram user callback");
    passport.authenticate('instagram'),
        function(req, res) {
            res.render("/components/main")
        };
};