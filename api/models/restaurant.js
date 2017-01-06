var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restSchema = new Schema ({
    name: {
        required: true,
        type: String,
        trim: true,
        // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
        //match: /^([\w ,.!?]{1,100})$/
    },
    address: {
      street: {type: String,trim: true,},
      city: {type: String,trim: true,},
      state: {type: String,trim: true,},
      country: {type: String,trim: true,}
    },
    phone: {type: String,trim: true},
    website: {type: String,trim: true,},
    email: {type: String,trim: true,},
    description: {type: String,trim: true,},
    comments: [{
        text: {
            type: String,
            trim: true,
            max:2000
        },
        author: {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String
        }
    }],
    likes: {type: Number,default: 0},
    staffs: [],
    managers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    menu:{
        appetizer: [],
        sides: [],
        drinks: [],
        main: [],
        courses: [],
        deserts: [],
    },
    photos:[],
    pioneer: {
        type: String,
        trim: true,
    },
    rating:{type: Number},
    totalReviews:{type: Number},
    verified: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: true
    });


module.exports = mongoose.model("Restaurant", restSchema);