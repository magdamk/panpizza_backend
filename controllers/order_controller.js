const Item = require('../models/item');
const User = require('../models/user');
const Order = require('../models/order');

exports.addOrder = async(req, res, next) => {
    try {
        const newOrder = new Order({
            "user": req.params.userID,
            "date": new Date(),
            "status": 'new',
            "payment": req.body.payment,
            "products": req.body.products
        });
        const addedOrder = await newOrder.save();
        res.status(201).send({ msg: 'Order added!', addedOrder });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.changeOrderStatus = async(req, res, next) => {
    try {

    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}