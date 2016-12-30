var jwt = require('jwt-simple'),
    moment = require('moment'),
    bcrypt = require('bcryptjs'),
    request = require('request'),
    User = require('../models/user'),
    Blog = require('../models/blog'),
    multer = require('multer'),
    mkdirp = require('mkdirp'),
    authHelper = require('../auth/authHelpers');

var rootMulterPath = './public/images/uploads/',
    multerPath = '';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        setMulterPath(req.body.username);
        mkdirp.sync(multerPath);
        cb(null, multerPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 //limit file size to 10 megabytes.
    }
}).array("file", 10);

function setMulterPath(username) {
    multerPath = rootMulterPath + username;
}

module.exports.new = function (req, res) {
    console.log('form: ', req.body);
    console.log("photos in new: ", photos);
    req.body.photos.forEach(function(current, index) {
        req.body.photos[index] = current.substring("./public".length);
        //photos[index] = current;
        console.log("current:" + current + " DD " + req.body.photos[index]);
    });
    var form = req.body;
    console.log("form.photos: ", form.photos);
    var blog = {
        title: form.title,
        ratings: form.ratings,
        descriptions : form.descriptions,
        author: form.author,
        photos: form.photos,
    };

    Blog.create(blog, function(err, newBlog) {
        if(err){
            console.log(err);
        } else {
            //console.log(newBlog);
            res.status(200).send();
        }
    });
};
var photos = [];
module.exports.upload = function (req, res) {

    upload(req, res, function(err) {
        //console.log("inside file's'", req.files);
        //console.log("inside body: ", req.body);
        if(err) {
            console.log("multer error: ", err);
            res.status(400).send();
        } else {
            photos.push(multerPath + '/' + req.files[0].originalname);
            res.status(200).send({photos: photos});
        }
    })
};

module.exports.getIndexBlogs = function(req, res) {
console.log("req.body_id", req.params);
    Blog.find({'author.id' : req.params.user}, function(err, foundBlog) {
        if (err) {
            console.log("Blog.findById fail: ", err);
        } else {
            //console.log("Blog.findById Success: ", foundBlog);
            res.status(200).send({blog: foundBlog});
        }
    })
};

module.exports.getShowBlog = function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err){
            console.log("getShowBlog err: ", err);
        } else {
            res.status(200).send({blog:foundBlog});
        }
    })
}