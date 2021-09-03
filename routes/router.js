const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/users.js');
router.post('/sign-up', userMiddleware.validateRegister, async(req, res, next) => {
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


});
router.post('/login', async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.body.email });
        console.log(checkUser);
        if (!checkUser.length) {
            res.status(401).send({
                msg: '1 Username or password is incorrect!'
            });
        } else {
            const isValid = await bcrypt.compare(req.body.password, checkUser[0].password);
            if (!isValid) {
                console.log(req.body.password);
                console.log(checkUser[0].password)
                return res.status(401).send({
                    msg: '2 Username or password is incorrect!'
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
                checkUser[0].last_login = new Date();
                const updatedUserLogin = await checkUser[0].save()
                res.status(201).send({ message: 'Logged in!' });
            }
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});
router.get('/secret-route', (req, res, next) => {
    res.send('This is the secret content. Only logged in users can see that!');
});
module.exports = router;