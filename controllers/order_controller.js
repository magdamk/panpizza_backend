const Item = require('../models/item');
const User = require('../models/user');
const Order = require('../models/order');

exports.addOrder = async(req, res, next) => {
    try {
        const now = new Date();
        const newOrder = new Order({
            "user": req.params.userID,
            "date": now,
            "dateString": now.toDateString(),
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
        let checkOrder = await Order.find({ _id: req.params.orderID });
        if (!checkOrder.length) {
            res.status(401).send({
                msg: 'Order not found!'
            });
        } else {
            console.log(checkOrder);
            checkOrder[0].status = req.body.status;
            const updatedOrderStatus = await checkOrder[0].save()
            res.status(201).send({ msg: 'Status changed!', updatedOrderStatus });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getMyOrders = async(req, res, next) => {
    try {
        const checkOrders = await Order.find({ user: req.params.userID }).sort({ date: -1 });
        console.log(checkOrders);
        res.status(201).send({ msg: 'Orders sent!', checkOrders });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getAllOrders = async(req, res, next) => {
    try {
        let today = new Date();
        today = today.toDateString();
        const checkOrders = await Order.find({ dateString: today }).sort({ date: 1 });
        console.log(checkOrders);
        res.status(201).send({ msg: 'Orders sent!', checkOrders });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}