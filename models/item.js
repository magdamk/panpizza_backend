const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        rquired: true
    },
    photo: {
        type: String,
        rquired: true
    },
    description: {
        type: String,
        rquired: true
    },
    type: {
        type: String,
        rquired: true,
        enum: ["pizza", "drink"]
    },
    position: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Item', itemSchema);