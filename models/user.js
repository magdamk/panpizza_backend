const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        rquired: true
    },
    password: {
        type: String,
        rquired: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    registered: {
        type: Date,
        required: true
    },
    last_login: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    house: {
        type: String,
        required: true
    },
    flat: {
        type: String,
        required: false
    },
    zip: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('User', userSchema);