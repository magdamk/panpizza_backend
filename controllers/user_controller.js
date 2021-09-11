const User = require('../models/user');

exports.getUserData = async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.params.email.toLowerCase() });
        if (!checkUser.length) {
            res.status(409).send({
                msg: 'User not found'
            });
        } else {
            const user = checkUser[0];
            const userData = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                street: user.street,
                house: user.house,
                flat: user.flat,
                city: user.city,
                zip: user.zip,
                phone: user.phone
            }
            res.status(201).send({ userData: userData, msg: '' });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.updateUserData = async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.params.email.toLowerCase() });
        if (!checkUser.length) {
            res.status(409).send({
                msg: 'User not found'
            });
        } else {
            const user = checkUser[0];
            if (req.body.first_name) user.first_name = req.body.first_name;
            if (req.body.last_name) user.last_name = req.body.last_name;
            if (req.body.street) user.street = req.body.street;
            if (req.body.house) user.house = req.body.house;
            if (req.body.flat) user.flat = req.body.flat;
            if (req.body.zip) user.zip = req.body.zip;
            if (req.body.city) user.city = req.body.city;
            if (req.body.phone) user.phone = req.body.phone;
            const updatedUser = await user.save();
            res.status(201).send({ userData: updatedUser, msg: '' });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}