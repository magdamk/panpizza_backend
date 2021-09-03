const jwt = require("jsonwebtoken");
// poprawić do modelu 
module.exports = {
    validateRegister: (req, res, next) => {
        // username min length 3

        if (!req.body.email || req.body.email < 3) {
            return res.status(400).send({
                msg: 'Please enter a name with min. 3 chars'
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
    }
};