const jwt = require("jsonwebtoken");
require('dotenv').config();
const validator = require("email-validator");
const User = require('../models/user');
// poprawić do modelu 
module.exports = {
    validateRegister: (req, res, next) => {
        // username min length 3

        if (!req.body.email || req.body.email < 3) {
            return res.status(400).send({
                msg: 'Please enter a name with min. 3 chars'
            });
        }
        // valide email
        if (!req.body.email || !validator.validate(req.body.email)) {
            return res.status(400).send({
                msg: "Please enter a valid email address",
            });
        }
        // password min 6 chars
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                msg: 'Please enter a password with min. 6 chars'
            });
        }
        // password (repeat) does not match
        if (!req.body.password_repeat ||
            req.body.password != req.body.password_repeat
        ) {
            return res.status(400).send({
                msg: 'Both passwords must match'
            });
        }
        next();
    },
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(
                token,
                process.env.SECRETKEY
            );
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).send({
                msg: 'Your session is not valid!'
            });
        }
    },
    isAdmin: async(req, res, next) => {
        try {
            let checkUser = await User.find({ email: req.userData.email.toLowerCase() });
            if (checkUser[0].role !== 'admin') return res.status(401).send({
                msg: 'Access denied!'
            });
            else {
                next();
            }
        } catch (err) {
            return res.status(401).send({
                msg: 'Access denied!'
            });
        }
    }
};