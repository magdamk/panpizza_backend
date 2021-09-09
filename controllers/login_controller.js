const User = require('../models/user');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const mailer = require("../mailer.js");

exports.postSignUp = async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.body.email.toLowerCase() });
        if (checkUser.length) {
            res.status(409).send({
                msg: 'This email is already in use!'
            });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                email: req.body.email.toLowerCase(),
                registered: new Date(),
                last_login: new Date(),
                password: hashedPassword,
                token: uuid.v4()
            })
            const addedUser = await newUser.save();
            console.log(addedUser);
            const sentMail = await mailer.sendOptInMail(
                addedUser.email,
                addedUser._id,
                addedUser.token
            );
            console.log(sentMail);
            res.status(201).send({ msg: 'Registered! Please check your e-mail account for activation link.' });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getVerify = async(req, res, next) => {
    try {
        let userID = req.params.userID;
        let token = req.params.token;
        let checkUser = await User.find({ _id: userID });
        console.log("verify", checkUser);
        // no result from database
        if (!checkUser.length) {
            return res.status(409).send({
                msg: "The requested parameters are incorrect!",
            });
        }
        // already activated
        if (checkUser[0].active) {
            return res.status(409).send({
                msg: "Account is already activated!",
            });
        }
        // wrong activation token
        if (checkUser[0].token !== token) {
            return res.status(401).send({
                msg: "The requested parameters are incorrect!",
            });
        }
        // set account active
        checkUser[0].active = true;
        const updatedUserLogin = await checkUser[0].save();
        return res.status(200).send({
            msg: "Account activated",
        });
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.postLogin = async(req, res, next) => {
    try {
        let checkUser = await User.find({ email: req.body.email.toLowerCase() });
        // console.log(checkUser);
        if (!checkUser.length) {
            res.status(401).send({
                msg: 'Username or password is incorrect!'
            });
        } else {
            if (!checkUser[0].active) {
                return res.status(401).send({
                    msg: "Your account is not activated! Please check your e-mail account for activation link.",
                });
            }
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
                console.log(checkUser[0].email)
                res.status(201).send({ msg: 'Logged in!', token, email: checkUser[0].email });
            }
        }

    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getSecretRoute = (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
}