const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/users.js');
const loginController = require('../controllers/login_controller');

router.post('/sign-up', userMiddleware.validateRegister, loginController.postSignUp);
router.post('/login', loginController.postLogin);
router.get('/secret-route', userMiddleware.isLoggedIn, loginController.getSecretRoute);
module.exports = router;