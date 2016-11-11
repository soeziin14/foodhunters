var jwt = require('jwt-simple'),
    moment = require('moment'),
    bcrypt = require('bcryptjs'),
    request = require('request'),
    User = require('../models/user'),
    authHelper = require('../auth/authHelpers');

var config = require('../auth/authConfig');

//module.exports.getUser = function (req, res, next) {
//    console.log("getting user...", req.params.userId);
//
//    User.findById(req.params.userId).populate("comments").exec(function (err, foundUser) {
//        if (err) {
//            console.log(err);
//        } else {
//            console.log(foundUser);
//            //render show template with that campground
//            res.status(200).json({success: true, user: foundUser});
//        }
//    });
//};

module.exports.instagramSignin = function (req, res, next) {
    //console.log("getting Instagram user!!...", req.body, res);
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
    //console.log("req.body: ", req.body);
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.INSTAGRAM_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    };
    // Step 1. Exchange authorization code for access token.
    request.post({url: accessTokenUrl, form: params, json: true}, function (error, response, body) {
        // Step 2a. Link user accounts.
        if (req.header('Authorization')) {
            User.findOne({instagram: body.user.id}, function (err, existingUser) {
                if (existingUser) {
                    var token = authHelper.createJWT(existingUser);
                    return res.send({success: true, token: token, user: existingUser});
                }
                var token = req.header('Authorization').split(' ')[1];
                var payload = jwt.decode(token, config.TOKEN_SECRET);

                var user = new User({
                    fullName: body.user.full_name,
                    instagram: body.user.id,
                    picture: body.user.profile_picture,
                    displayName: body.user.username
                });
                user.save(function (err, user) {
                    var token = authHelper.createJWT(user);
                    res.send({token: token, user: user});
                });
                //});
            });
        } else {
            // Step 2b. Create a new user account or return an existing one.
            User.findOne({instagram: body.user.id}, function (err, existingUser) {
                if (existingUser) {

                    var token = authHelper.createJWT(existingUser);
                    return res.send({success: true, token: token, user: existingUser});
                }

                var user = new User({
                    instagram: body.user.id,
                    picture: body.user.profile_picture,
                    displayName: body.user.username
                });
                user.save(function () {
                    var token = authHelper.createJWT(user);
                    res.send({token: token, user: user});
                });
            });
        }
    });
};

module.exports.getInstagramUser = function (req, res, next) {

    User.findById(req.user).populate("comments").exec(function (err, user) {
        console.log("user: ", user);
        if (!user) {
            return res.status(400).send({message: 'User not found'});
        }
        res.send({success: true, user: user});
    });
}