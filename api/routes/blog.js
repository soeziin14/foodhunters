var express = require('express');
var router = express.Router();
var blogController = require('../CRUD/blog.js');
var multer = require('multer');

router
    .route('/new')
    .post(blogController.new);
router
    .post('/uploads3', blogController.uploadS3);

router
    .route('/:user')
    .get(blogController.getAllUserBlogs);
router
    .route('/recent/:count')
    .get(blogController.getRecentCountBlogs);
router
    .route('/:user/:id')
    .get(blogController.getOneUserBlog)
    .put(blogController.putOneUserBlog);

module.exports = router;
