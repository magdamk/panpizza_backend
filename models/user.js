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
    token: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
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
    },
    street: {
        type: String,
    },
    house: {
        type: String,
    },
    flat: {
        type: String,
    },
    zip: {
        type: String,
    },
    phone: {
        type: Number
    }
});

module.exports = mongoose.model('User', userSchema);