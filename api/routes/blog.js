var express = require('express');
var router = express.Router();
var blogController = require('../CRUD/blog.js');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

/* GET users listing. */
router
    .route('/')
    .get(function(req, res, next) {
      res.send('respond with a resource');
    })
    .post(blogController.new);

router
    .route('/upload')
    .post(multipartyMiddleware, blogController.upload);

module.exports = router;
