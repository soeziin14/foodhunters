var express = require('express'),
    router  = express.Router(),
    restaurantController = require('../CRUD/restaurant.js');

router
    .route('/')
    .get(restaurantController.getValidateRestaurants);

router
    .route('/new')
    .post(restaurantController.newRestaurant);

router
    .route('/:id')
    .put(restaurantController.validateRestaurant);

router
    .route('/allValidatedRestaurants')
    .get(restaurantController.getAllValidatedRestaurants);

module.exports = router;