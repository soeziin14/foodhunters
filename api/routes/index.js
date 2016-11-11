var express             = require('express'),
    User                = require('../models/user'),
    authHelper          = require('../auth/authHelpers'),
    userContoller       = require('../CRUD/users.js'),
    router              = express.Router();


//User authentications
router
    .route('/auth/instagram')
    .post(userContoller.instagramSignin);

router
    .route('/api/CRUD/:userId')
    .get(authHelper.ensureAuthenticated, userContoller.getInstagramUser);

router.put('/api/me', authHelper.ensureAuthenticated, function(req, res) {
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


module.exports = router;
