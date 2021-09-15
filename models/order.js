const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    date: {
        type: Date,
        required: true
    },
    dateString: {
        type: String,
        required: true
    },
    products: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'item'
    }],
    payment: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'new'
    }
});

module.exports = mongoose.model('Order', orderSchema);