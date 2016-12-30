var     mongoose            = require('mongoose'),
        roles               = 'scouter blogger manager'.split(' '),
        bcrypt              = require('bcryptjs'),
        level               = 'Cat Cougar Lion'.split(' ');

var userSchema = new mongoose.Schema({

    accessToken: String,
    email: { type: String, unique: true, lowercase: true, trim:true },
    password: { type: String, select: false },
    displayName: String,
    picture: String,
    facebook: String,
    google: String,
    instagram: String,
    address: {type: String,trim: true},
    fullName: {type: String,trim: true},
    introduction: String,
    reputation:{type: Number,default: 0},
    photos: [],
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
    managingRestaurants: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    }]
    },
    {
        timestamps: true
    });


userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

module.exports = mongoose.model("User", userSchema);