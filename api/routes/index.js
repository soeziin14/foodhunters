var express             = require('express'),
    passport            = require('passport'),
    jwt                 = require('jwt-simple'),
    moment              = require('moment'),
    bcrypt              = require('bcryptjs'),
    request             = require('request'),
    User                = require('../models/user-oauth'),
    router              = express.Router();

var userContoller       = require('../CRUD/users.js');
var config = {TOKEN_SECRET: 'what is my s3cr3t'};

function ensureAuthenticated(req, res, next) {
        if (!req.header('Authorization')) {
                return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
        }
        var token = req.header('Authorization').split(' ')[1];

        var payload = null;
        try {
                payload = jwt.decode(token, config.TOKEN_SECRET);
        }
        catch (err) {
                return res.status(401).send({message: err.message});
        }

        if (payload.exp <= moment().unix()) {
                return res.status(401).send({message: 'Token has expired'});
        }
        req.user = payload.sub;
        next();
}
var allowCrossDomain = function(req, res, next) {

        if ('OPTIONS' == req.method) {
                res.send(200);
        }
        else {
                next();
        }
};
function createJWT(user) {
        var payload = {
                sub: user._id,
                iat: moment().unix(),
                exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, config.TOKEN_SECRET);
}
router.get('/api/me', ensureAuthenticated, function(req, res) {
        User.findById(req.user, function(err, user) {
                res.send(user);
        });
});
router.put('/api/me', ensureAuthenticated, function(req, res) {
        User.findById(req.user, function(err, user) {
                if (!user) {
                        return res.status(400).send({ message: 'User not found' });
                }
                user.displayName = req.body.displayName || user.displayName;
                user.email = req.body.email || user.email;
                user.save(function(err) {
                        res.status(200).end();
                });
        });
});
//User authentications
router
    .route('/api/CRUD/signup')
    .post(userContoller.signup);

router
    .route('/api/CRUD/signin')
    .post(userContoller.signin);

router
    .route('/api/CRUD/signout')
    .get(userContoller.signout);

router.post('/auth/instagram', function(req, res) {
        var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
console.log("req.body: ", req.body);
        var params = {
                client_id: req.body.clientId,
                redirect_uri: req.body.redirectUri,
                client_secret: '977a975146c1418d839bb2d540abdd2e',
                code: req.body.code,
                grant_type: 'authorization_code'
        };

        // Step 1. Exchange authorization code for access token.
        request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {
console.log("req.body 2: ", body);
                // Step 2a. Link user accounts.
                if (req.header('Authorization')) {
                        User.findOne({ instagram: body.user.id }, function(err, existingUser) {
                                if (existingUser) {
                                        return res.status(409).send({ message: 'There is already an Instagram account that belongs to you' });
                                }

                                var token = req.header('Authorization').split(' ')[1];
                                var payload = jwt.decode(token, config.TOKEN_SECRET);
console.log("token: ", payload);
                                User.findById(payload.sub, function(err, user) {
                                        if (!user) {
                                                return res.status(400).send({ message: 'User not found' });
                                        }
                                        user.instagram = body.user.id;
                                        user.picture = user.picture || body.user.profile_picture;
                                        user.displayName = user.displayName || body.user.username;
                                        user.save(function() {
                                                var token = createJWT(user);
                                                res.send({ token: token });
                                        });
                                });
                        });
                } else {
                        // Step 2b. Create a new user account or return an existing one.
                        User.findOne({ instagram: body.user.id }, function(err, existingUser) {
                                if (existingUser) {
                                        return res.send({ token: createJWT(existingUser) });
                                }

                                var user = new User({
                                        instagram: body.user.id,
                                        picture: body.user.profile_picture,
                                        displayName: body.user.username
                                });

                                user.save(function() {
                                        var token = createJWT(user);
                                        res.send({ token: token, user: user });
                                });
                        });
                }
        });
});

//router
//    .route('/api/auth/instagram')
//    .get(userContoller.getInstagramUser);
//
//router.get('/api/auth/instagram/callback', passport.authenticate('instagram'),
//    function(req, res){
//        console.log("param: ", req.query);
//        res.setHeader("Content-Type", "application/json");
//        console.log("req:", res.user, " FF ", req.user);
//        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
//        res.status(200).json({success: true, user: req.user});
//        //res.render('components/user/profile/profile', {currentUser: req.user});
//    });


router
    .route('/api/CRUD/:userId')
    .get(userContoller.getUser);


module.exports = router;
