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
            console.log(userData);
            res.status(201).send({ userData: userData, msg: '' });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}