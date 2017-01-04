var express = require('express');
var router = express.Router();
var blogController = require('../CRUD/blog.js');
var multer = require('multer');

router
    .route('/')
    .post(blogController.new);

router
    .route('/upload')
    .post(blogController.upload);

router
    .route('/:user')
    .get(blogController.getIndexBlogs);
router
    .route('/recent/:count')
    .get(blogController.getRecentBlogs);
router
    .route('/:user/:id')
    .get(blogController.getShowBlog);



module.exports = router;
