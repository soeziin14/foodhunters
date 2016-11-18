var jwt = require('jwt-simple'),
    moment = require('moment'),
    bcrypt = require('bcryptjs'),
    request = require('request'),
    User = require('../models/user'),
    authHelper = require('../auth/authHelpers');

var config = require('../auth/authConfig');

module.exports.signup = function (req, res) {
    User.findOne({email: req.body.email}, function (err, existingUser) {

        if (err) {
            console.log("err", err);
        }
        if (existingUser) {
            return res.status(409).send({message: 'Email is already taken.'});
        }

        var user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        });
        console.log("signing up...", user);
        user.save(function () {
            var token = authHelper.createJWT(user);
            res.send({token: token, user: user});
        });
    });
}
module.exports.login = function (req, res) {
    User.findOne({email: req.body.email}, '+password', function (err, user) {
        if (!user) {
            console.log("no user");
            return res.status(401).send({message: {email: 'Incorrect email'}});
        }
        //console.log("user found," + user);
        //console.log("PW: ", req.body.password);
        //console.log("pw2: ", user.password);
        bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({message: {password: 'Incorrect password'}});
            }
            user = user.toObject();
            delete user.password;

            var token = authHelper.createJWT(user);
            res.send({token: token, user: user});
        });
    });
};

module.exports.linkInstagram = function (req, res) {
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
    console.log("req.body!!!!! ", req.body);
    var email = req.body.email;
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.INSTAGRAM_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    };
    // Step 1. Exchange authorization code for access token.
    request.post({url: accessTokenUrl, form: params, json: true}, function (error, response, body) {
        console.log("entire body: ", body);

        if (req.header('Authorization')) {
            console.log('auth body.user', body.user);
            if(req.body.email) {console.log("has email");
                User.findOneAndUpdate({email: email}, {
                    fullName: body.user.full_name,
                    instagram: body.user.id,
                    picture: body.user.profile_picture,
                    displayName: body.user.username,
                    accessToken: body.access_token
                }, function (err, user) {
                    if (err) { console.log("err", err);}
                    if (user){
                        var token = authHelper.createJWT(user);
                        res.status(200).send({ token: token, user: user})
                    }
                });
            } else {
                User.findOne({instagram: body.user.id}, function (err, existingUser) {
                    if (err) {
                        console.log("Err finding instagram.user.id in db");
                        return;
                    }
                    if (existingUser) {console.log("auth exiting: ", existingUser);
                        return res.status(409).send({message: 'There is already an Instagram account that belongs to you'});
                    }
                });
                var user = new User({
                    instagram: body.user.id,
                    displayName: body.user.username,
                    fullName: body.user.full_name,
                    picture: body.user.profile_picture,
                    accessToken: body.access_token
                });
                user.save(function() {
                    var token = authHelper.createJWT(user);
                    console.log("yes auth save and send token", token);
                    console.log("yes auth save and send user", user);
                    res.status(200).send({ token: token, user: user });
                });
            }

        } else {
            console.log("no auth header body.user: ", body.user);
            // Step 2b. Create a new user account or return an existing one.
            User.findOne({instagram: body.user.id}, function (err, existingUser) {
                if (err) {
                    console.log("err:", err);
                    return;
                }
                if (existingUser) {console.log("exisitng: ", existingUser);
                    var token = authHelper.createJWT(existingUser);
                    return res.status(200).send({token: token, user: existingUser});
                }console.log("nonexisitng user: ");

                if(req.body.email) {
                    User.findOneAndUpdate({email: email}, {
                        fullName: body.user.full_name,
                        instagram: body.user.id,
                        picture: body.user.profile_picture,
                        displayName: body.user.username,
                        accessToken: body.access_token
                    }, function (err, user) {
                        if (err) {
                            console.log("unauth save", user);
                            console.log("User must provide email.");
                        }
                    });
                } else {
                    var user = new User({
                        instagram: body.user.id,
                        displayName: body.user.username,
                        fullName: body.user.full_name,
                        picture: body.user.profile_picture,
                        accessToken: body.access_token
                    });
                    user.save(function() {
                        var token = authHelper.createJWT(user);
                        console.log("no auth save and send token", token);
                        console.log("no auth save and send user", user);
                        res.status(200).send({ token: token, user: user });
                    });
                }
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
};

module.exports.getInstagramUserFeed = function (req, res, next) {


}