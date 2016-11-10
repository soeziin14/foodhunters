var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var roles = 'scouter blogger admin manager'.split(' ');
var level = 'Cat Cougar Lion'.split(' ');

var userSchema = new mongoose.Schema({
    address: {
      type: String,
      trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    //passport username cannot be userName?!
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: String,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    introduction: String,
    role: {
        type:String,
        enum: roles,
        required: true,
        default: roles[0]
    },
    banned: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    level: {
        type: String,
        enum: level,
        required: true,
        default: level[0]
    },
    hyenas: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    reputation: {
        type: Number,
        default: 0
    },
    photoUrl: String,
    facebookUrl: String,
    created: {
        type: Date,
        default: Date.now
    },
    comments: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    }],
    restaurantsVisited: [{
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant"
      }
    }],
    blogs: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    }],
    },
    {
        timestamps: true
    });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);