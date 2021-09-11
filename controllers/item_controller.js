const Item = require('../models/item');

exports.getAllItems = async(req, res, next) => {
    try {
        const menu = await Item.find({});
        res.status(201).send({ msg: 'Menu sent', menu });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}
exports.addItem = async(req, res, next) => {
    try {
        const newItem = new Item({
            "name": req.body.name,
            "photo": req.body.photo,
            "description": req.body.description,
            "available": req.body.available,
            "price": req.body.price
        });
        const addedItem = await newItem.save();
        console.log('item', addedItem);
    } catch (err) {
        console.log('add-item-error');
        res.status(500).json({ msg: err.message })
    }
}