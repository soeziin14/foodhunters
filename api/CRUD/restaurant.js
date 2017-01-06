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
module.exports.getRestaurant = function(req, res){
console.log("!!", req.params);
    Restaurant.findById(req.params.id, function(err, restaurant) {
        if(err) {
            console.log("getRestaurant err: ", err);
        } else {
            console.log("getRestaurant  success: ", restaurant);
            res.send({restaurant: restaurant});
        }
    })
};

module.exports.getInvalidRestaurants = function(req, res) {
console.log("Invalid?");
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

module.exports.getValidRestaurants = function(req, res) {
    Restaurant.find({verified: true}, function(err, restaurants) {
        if(err) {
            console.log("getValidRestaurants fail: ", err);
        } else {
            console.log("getValidRestaurants success: ", restaurants);
            res.status(200).send({restaurants: restaurants});
        }
    })
};
module.exports.getRecentRestaurants = function(req, res){

    Restaurant.find({verified: true}).sort({$natural: -1}).limit(Number(req.params.count)).exec(function(err, restaurants){
        if(err){
            console.log("getRecentRestaurants err: ", err);
        } else {
            res.status(200).send({restaurants:restaurants});
        }
    });
};
