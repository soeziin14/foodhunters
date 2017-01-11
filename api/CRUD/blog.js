var jwt = require('jwt-simple'),
    moment = require('moment'),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    request = require('request'),
    User = require('../models/user'),
    Blog = require('../models/blog'),
    aws = require('../aws/aws'),
    AWS = require('aws-sdk'),
    s3Url = 'http://' + 'commensalism.uploads' + '.s3' + '.amazonaws.com',
    authHelper = require('../auth/authHelpers');

AWS.config.update({
    region: "us-east-1",
    endpoint: "dynamodb.us-east-1.amazonaws.com",
    accessKeyId: aws.ACCESS_KEY,
    secretAccessKey: aws.SECRET_KEY,
});

module.exports.new = function (req, res) {

    var form = req.body;
    console.log("form.photos: ", form);

    var table       = "Blog",
        author      = form.author.id,
        timestamp   = form.timestamp;

    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
            TableName:table,
            Key:{
                "author": author,
                "timestamp": timestamp,
            },
            UpdateExpression:
                              "set title = if_not_exists(title, :title),"+
                              "descriptions = if_not_exists(descriptions, :descriptions),"+
                              "ratings = if_not_exists(ratings, :ratings)"+
                              "add #photos :photos",
            ExpressionAttributeNames:{
                "#photos": "photos",
            },
            ExpressionAttributeValues: {
                ":title": form.title,
                ":descriptions": form.descriptions,
                ":ratings": form.ratings,
                ":photos": docClient.createSet([form.photos]),
            }
        };
        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    res.status(200).send({success: true});
};

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
//all blogs (index page)
module.exports.getAllUserBlogs = function(req, res) {
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
//one user blog
module.exports.getOneUserBlog = function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err){
            console.log("getOneUserBlog err: ", err);
        } else {
            res.status(200).send({blog:foundBlog});
        }
    })
};
module.exports.putOneUserBlog = function(req, res){


};
//recent blogs
module.exports.getRecentCountBlogs = function (req, res){
    //console.log("count",req.params.count, typeof req.params.count);
    Blog.find().sort({$natural: -1}).limit(Number(req.params.count)).exec(function(err, blogs){
        if(err){
            console.log("getRecentCountBlogs err: ", err);
        } else {
            res.status(200).send({blogs:blogs});
        }
    });
};