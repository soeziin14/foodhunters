var express = require('express'),
    User = require('../models/user'),
    authHelper = require('../auth/authHelpers'),
    userController = require('../CRUD/users.js'),
    request = require('request');
router = express.Router();

router
    .route('/auth/signup')
    .post(userController.signup);

router
    .route('/auth/login')
    .post(userController.login);

//User authentications
router
    .route('/auth/instagram')
    .post(userController.linkInstagram);

router.get('/api/feed/:token', function (req, res) {
    var feedUrl = 'https://api.instagram.com/v1/users/self/media/recent';console.log("param token: ", req.params.token);
    var params = {access_token: req.params.token}; console.log("user: ", req.user);
    console.log("feed token:", params.access_token);
    request.get({url: feedUrl, qs: params, json: true}, function (error, response, body) {
        if (error) {
            console.log("Fetch recent media err: ", error);
        }
    console.log("what's the boyd? ", body);
        if (!error && response.statusCode == 200) {
            res.send(body.data);
        }
    });
});

router
    .route('/api/CRUD/:userId')
    .get(authHelper.ensureAuthenticated, userController.getInstagramUser);

router.put('/api/me', authHelper.ensureAuthenticated, function (req, res) {
    User.findById(req.user, function (err, user) {
        if (!user) {
            return res.status(400).send({message: 'User not found'});
        }
        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.save(function (err) {
            res.status(200).end();
        });
    });
});


module.exports = router;
