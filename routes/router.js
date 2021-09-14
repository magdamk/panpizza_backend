const express = require('express');
const router = express.Router();

const userMiddleware = require('../middleware/users.js');
const loginController = require('../controllers/login_controller');
const userController = require('../controllers/user_controller')
const itemController = require('../controllers/item_controller')

router.post('/sign-up', userMiddleware.validateRegister, loginController.postSignUp);
router.get("/verify/:userID/:token", loginController.getVerify);
router.post('/login', loginController.postLogin);
router.delete('/logout', loginController.deleteLogout);

router.get('/user/:email', userMiddleware.isLoggedIn, userController.getUserData);
router.patch('/user/:email', userMiddleware.isLoggedIn, userController.updateUserData);

router.get('/home', itemController.getAllItems);
router.get('/home/:itemID', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.getItemByID);
router.patch('/home/:itemID', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.updateItem);
router.post('/home/add', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.addMenuItem);
router.delete('/home/del/:itemID', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.deleteItem);

router.get('/secret-route', userMiddleware.isLoggedIn, userMiddleware.isAdmin, loginController.getSecretRoute);

module.exports = router;