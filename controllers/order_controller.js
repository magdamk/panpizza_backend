const mongoose = require('mongoose');
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
            "dateString": now.toISOString().split("T")[0],
            "status": 'pending',
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
            if (req.body.status === 'in progress') {
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

exports.getUserOrders = async(req, res, next) => {
    try {
        let checkOrders = await Order.aggregate([{ $match: { user: mongoose.Types.ObjectId(req.params.userID) } }, {
            $lookup: {
                from: 'items',
                localField: 'products',
                foreignField: '_id',
                as: 'product'
            }
        }]).sort({ date: -1 });

        res.status(201).send({ msg: 'Orders sent!', userOrders: checkOrders });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getOrder = async(req, res, next) => {
    try {
        const checkedOrder = await Order.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.orderID) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'products',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $project: { client: { registered: 0, token: 0, role: 0, password: 0, active: 0, last_login: 0 } } }
        ]);
        res.status(201).send({ msg: 'Order sent!', order: checkedOrder });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getAllOrders = async(req, res, next) => {
    try {
        const query = req.query;
        const criteria = {};
        let today = new Date();
        today = today.toISOString().split("T")[0];
        if (query.user) { criteria.user = mongoose.Types.ObjectId(query.user) };
        if (query.dateString) { criteria.dateString = query.dateString } else { criteria.dateString = today };
        const checkOrders = await Order.aggregate([{ $match: criteria }, {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'products',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $project: { client: { registered: 0, token: 0, role: 0, password: 0, active: 0, last_login: 0 } } }
            //, { $group: { _id: "$status" } }
        ]).sort({ status: -1, date: -1 });
        res.status(201).send({ msg: 'Orders sent!', orders: checkOrders });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}