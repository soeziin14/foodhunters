var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema ({
    title: {
        required: true,
        type: String,
        trim: true,
        // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
        //match: /^([\w ,.!?]{1,100})$/
    },
    ratings: {
        atmosphere: {
            type: Number,
        },
        food: {
            type: Number,
        },
        service: {
            type: Number,
        },
        price: {
          type: Number,
        },
        total: {
            type: Number
        }
    },
    descriptions: {
        atmosphere: {
            type: String,
            trim: true,
        },
        food: {
            type: String,
            trim: true,
        },
        service: {
            type: String,
            trim: true,
        }
    },
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
    likes: {
        type: Number,
        default: 0
    },
    restaurant: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    },
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    photos: [],
},
    {
        timestamps: true
    });


module.exports = mongoose.model("Blog", blogSchema);