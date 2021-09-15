const Item = require('../models/item');
const User = require('../models/user');
const Order = require('../models/order');
const mailer = require("../mailer.js");

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
            checkOrder[0].status = req.body.status;
            const updatedOrderStatus = await checkOrder[0].save();
            if (req.body.status === 'accepted') {
                const userID = checkOrder[0].user;
                const checkUser = await User.find({ _id: userID });
                const sentMail = await mailer.sendOrderMail(checkUser[0].email);
                //dodać usera - main i wysąłć mejl z potwierdzeniem przyjęcia zamówienia

            };
            res.status(201).send({ msg: 'Status changed!', updatedOrderStatus });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getMyOrders = async(req, res, next) => {
    try {
        const checkOrders = await Order.find({ user: req.params.userID }).sort({ date: -1 });
        res.status(201).send({ msg: 'Orders sent!', checkOrders });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getAllOrders = async(req, res, next) => {
    try {
        const query = req.query;
        console.log('query: ', query);
        const criteria = {};
        let today = new Date();
        today = today.toDateString();
        if (query.user) { criteria.user = query.user };
        if (query.dateString) { criteria.dateString = query.dateString } else { criteria.dateString = today };
        console.log('criteria: ', criteria);
        const checkOrders = await Order.find(criteria).sort({ date: -1 });
        let orders = [];
        for (let i = 0; i < checkOrders.length; i++) {
            let user = await User.find({ _id: checkOrders[i].user });
            let userData = {
                    email: user[0].email,
                    first_name: user[0].first_name,
                    last_name: user[0].last_name,
                    street: user[0].street,
                    house: user[0].house,
                    flat: user[0].flat,
                    city: user[0].city,
                    zip: user[0].zip,
                    phone: user[0].phone
                }
                //console.log('findUser: ', userData);
            orders[i] = checkOrders[i];
            orders[i].userInfo = userData;

        };
        res.status(201).send({ msg: 'Orders sent!', orders });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}