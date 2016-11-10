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
    description: {
        type: String,
        trim: true,
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
},
    {
        timestamps: true
    });


module.exports = mongoose.model("Restaurant", restSchema);