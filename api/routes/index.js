var express         = require('express'),
    passport        = require('passport'),
    router          = express.Router();

var userContoller       = require('../CRUD/users.js');
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

router
    .route('/api/auth/instagram')
    .get(userContoller.getInstagramUser);

router.get('/api/auth/instagram/callback', passport.authenticate('instagram'),
    function(req, res){
        console.log("param: ", req.query);
        res.setHeader("Content-Type", "application/json");
        console.log("req:", res.user, " FF ", req.user);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        res.status(200).json({success: true, user: req.user});
        //res.render('components/user/profile/profile', {currentUser: req.user});
    });


router
    .route('/api/CRUD/:userId')
    .get(userContoller.getUser);


module.exports = router;
