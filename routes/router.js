const express = require('express');
const router = express.Router();
//const User = require('../models/user');
//const bcrypt = require('bcryptjs');
//const uuid = require('uuid');
//const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/users.js');
const loginController = require('../controllers/login_controller');
const userController = require('../controllers/user_controller')

router.post('/sign-up', userMiddleware.validateRegister, loginController.postSignUp);
router.get("/verify/:userID/:token", loginController.getVerify);
router.post('/login', loginController.postLogin);

router.get('/user/:email', userMiddleware.isLoggedIn, userController.getUserData);
router.post('/user/:email', userMiddleware.isLoggedIn, userController.updateUserData);

router.get('/secret-route', userMiddleware.isLoggedIn, loginController.getSecretRoute);

module.exports = router;