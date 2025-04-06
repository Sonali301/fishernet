const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    boatname: {
        type: String,
        required: true
    },
    nettype: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    netsize: {
        length: {
            type: Number,
            required: true,
            min: 1
        },
        width: {
            type: Number,
            required: true,
            min: 1
        },
        depth: {
            type: Number,
            required: true,
            min: 1
        },
        unit: {
            type: String,
            required: true,
            enum: ['feet', 'meters']
        }
    },
    month: {
        type: String,
        required: true,
        enum: [
            'January', 'February', 'March', 'April', 
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ]
    },
    image: {
        url: String,
        filename: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;