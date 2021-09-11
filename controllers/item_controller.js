const Item = require('../models/item');

exports.getAllItems = async(req, res, next) => {
    try {
        const menu = await Item.find({}).sort({ position: 1 });
        res.status(201).send({ msg: 'Menu sent', menu });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getItemByID = async(req, res, next) => {
    try {
        const itemID = req.params.itemID;
        const item = await Item.find({ _id: itemID });
        res.status(201).send({ msg: 'Item sent', item });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.updateItem = async(req, res, next) => {
    try {
        const itemID = req.params.itemID;
        let checkItem = await Item.find({ _id: itemID });
        if (!checkItem.length) {
            res.status(409).send({
                msg: 'Item not found'
            });
        } else {
            const item = checkItem[0];
            if (req.body.name) item.name = req.body.name;
            if (req.body.description) item.description = req.body.description;
            if (req.body.photo) item.photo = req.body.photo;
            if (req.body.type) item.type = req.body.type;
            if (req.body.position) item.position = req.body.position;
            if (req.body.price) item.price = req.body.price;
            if (req.body.available) item.available = req.body.available;
            const updatedItem = await item.save();
            console.log(item);
            res.status(201).send({ item: updatedItem, msg: 'Item updated' });
        }

    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.addMenuItem = async(req, res, next) => {
    try {
        const newItem = new Item({
            "name": req.body.name,
            "photo": req.body.photo,
            "description": req.body.description,
            "available": req.body.available,
            "price": req.body.price,
            "type": req.body.type,
            "position": req.body.position
        });
        const addedItem = await newItem.save();
        res.status(201).send({ item: addedItem, msg: 'Item added!' });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}