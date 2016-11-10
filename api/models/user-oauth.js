var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var roles = 'scouter blogger admin manager'.split(' ');
var level = 'Cat Cougar Lion'.split(' ');

var userSchema = new mongoose.Schema({
        oauthID: String,
        name: String,
    },
    {
        timestamps: true
    });


module.exports = mongoose.model("UserOAuth", userSchema);