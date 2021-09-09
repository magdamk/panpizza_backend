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
        required: true,
        default: ' '
    },
    last_name: {
        type: String,
        required: true,
        default: ' '
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
        required: true,
        default: ' '
    },
    street: {
        type: String,
        required: true,
        default: ' '
    },
    house: {
        type: String,
        required: true,
        default: ' '
    },
    flat: {
        type: String,
        required: false,
        default: ''
    },
    zip: {
        type: String,
        required: true,
        default: ' '
    },
    phone: {
        type: Number,
        required: true,
        default: ' '
    }
});

module.exports = mongoose.model('User', userSchema);