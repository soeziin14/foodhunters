var express = require('express'),
    router  = express.Router(),
    restaurantController = require('../CRUD/restaurant.js');

router
    .route('/')

router
    .post('/new',restaurantController.newRestaurant);

router
    .get('/recent/:count',restaurantController.getRecentRestaurants)

router
    .get('/invalid', restaurantController.getInvalidRestaurants)
    .put('/invalid/:id', restaurantController.validateRestaurant);

router
    .get('/valid', restaurantController.getValidRestaurants);

router
    .get('/:id',restaurantController.getRestaurant)
//.put('/:id',restaurantController.updateRestaurant)

module.exports = router;