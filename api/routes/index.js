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

router.get('/api/feed/:token', userController.getInstagramUserFeed);

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
