var jwt = require('jwt-simple'),
    moment = require('moment'),
    bcrypt = require('bcryptjs'),
    request = require('request'),
    User = require('../models/user'),
    authHelper = require('../auth/authHelpers');

module.exports.new = function(req, res) {

    console.log("req.body: ", req.body);
    res.status(200).send();
    //var newCampground = {name: name, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    //Campground.create(newCampground, function(err, newlyCreated){
    //    if(err){
    //        console.log(err);
    //    } else {
    //        //redirect back to campgrounds page
    //        console.log(newlyCreated);
    //        res.redirect("/campgrounds");
    //    }
    //});
}

module.exports.upload = function (req, res) {

    var file = req.files.file;
    console.log("let's see: ", req.files);
    console.log("files size: ", req.files.length);
    console.log(file.name);
    console.log(file.type);
};