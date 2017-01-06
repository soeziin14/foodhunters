var jwt = require('jwt-simple'),
    moment = require('moment'),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    request = require('request'),
    User = require('../models/user'),
    Blog = require('../models/blog'),
    multer = require('multer'),
    mkdirp = require('mkdirp'),
    aws = require('../aws/aws'),
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

var s3Url = 'http://' + 'commensalism.uploads' + '.s3' + '.amazonaws.com';
module.exports.uploadS3 = function(req, res){
    var request = req.body;
    var fileName = request.filename
    var path = aws.BUCKET + fileName;
    var readType = 'private';

    var expiration = moment().add(5, 'm').toDate(); //15 minutes

    var s3Policy = {
        'expiration': expiration,
        'conditions': [{
            'bucket': aws.BUCKET
        },
            ['starts-with', '$key', path],
            {
                'acl': readType
            },
            {
                'success_action_status': '201'
            },
            ['starts-with', '$Content-Type', request.type],
            ['content-length-range', 2048, 10485760], //min and max
        ]
    };

    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    // sign policy
    var signature = crypto.createHmac('sha1', aws.SECRET_KEY)
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

    var credentials = {
        url: s3Url,
        fields: {
            key: path,
            AWSAccessKeyId: aws.ACCESS_KEY,
            acl: readType,
            policy: base64Policy,
            signature: signature,
            'Content-Type': request.type,
            success_action_status: 201
        }
    };
    res.jsonp(credentials);
};

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
};

module.exports.getRecentBlogs = function (req, res){
    //console.log("count",req.params.count, typeof req.params.count);
    Blog.find().sort({$natural: -1}).limit(Number(req.params.count)).exec(function(err, blogs){
        if(err){
            console.log("getRecentBlogs err: ", err);
        } else {
            res.status(200).send({blogs:blogs});
        }
    });
};