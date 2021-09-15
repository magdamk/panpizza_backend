const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        rquired: true,
        ref: 'user'
    },
    date: {
        type: Date,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item'
    }],
    amount_to_pay: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: 'new'
    }
});

module.exports = mongoose.model('Order', orderSchema);