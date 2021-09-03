const User = require('../models/user');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

exports.postSignUp = async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.body.email });
        if (checkUser.length) {
            res.status(409).send({
                msg: 'This email is already in use!'
            });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                email: req.body.email,
                registered: new Date(),
                last_login: new Date(),
                password: hashedPassword
            })
            const addedUser = await newUser.save();
            res.status(201).send({ message: 'Registered!' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.postLogin = async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.body.email });
        // console.log(checkUser);
        if (!checkUser.length) {
            res.status(401).send({
                msg: 'Username or password is incorrect!'
            });
        } else {
            const isValid = await bcrypt.compare(req.body.password, checkUser[0].password);
            if (!isValid) {
                return res.status(401).send({
                    msg: 'Username or password is incorrect!'
                });
            } else {
                const token = jwt.sign({
                        email: checkUser[0].email,
                        userId: checkUser[0]._id
                    },
                    process.env.SECRETKEY, {
                        expiresIn: '20m'
                    }
                );
                console.log(token)
                checkUser[0].last_login = new Date();
                const updatedUserLogin = await checkUser[0].save()
                res.status(201).send({ message: 'Logged in!' });
            }
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getSecretRoute = (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
}