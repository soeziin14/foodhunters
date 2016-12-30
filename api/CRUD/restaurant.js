var Restaurant = require('../models/restaurant');

module.exports.newRestaurant = function (req, res) {
console.log("req.body: ", req.body);
    var restaurant = req.body;

    Restaurant.create(restaurant, function(err, newRestaurant) {
       if(err) {
           console.log("restaurant create err: ", err);
       } else {
           //console.log("restaurant create success: ", newRestaurant);
           res.status(200).send({success: true});
       }
    });
};

module.exports.getValidateRestaurants = function(req, res) {

    Restaurant.find({verified: false}, function(err, restaurants) {
        if(err) {
            console.log("Get validateRestaurants err: ", err);
        } else {
            console.log("Get validateRestaurants success: ", restaurants);
            res.send({restaurants: restaurants});
        }
    })
};

module.exports.validateRestaurant = function(req, res) {
console.log("req: ", req.params.id);
    Restaurant.findByIdAndUpdate(req.params.id, {$set: {verified: true}}, function(err, restaurant) {
        if(err) {
            console.log("Validate Restaurant err: ", err);
        } else {
            res.status(200).send({restaurant: restaurant});
        }
    });
};

module.exports.getAllValidatedRestaurants = function(req, res) {
    Restaurant.find({verified: true}, function(err, restaurants) {
        if(err) {
            console.log("getAllValidatedRestaurants fail: ", err);
        } else {
            console.log("getAllValidatedRestaurants success: ", restaurants);
            res.status(200).send({restaurants: restaurants});
        }
    })
};
