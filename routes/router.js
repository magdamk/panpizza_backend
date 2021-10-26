const express = require('express');
const router = express.Router();

const userMiddleware = require('../middleware/users.js');
const loginController = require('../controllers/login_controller');
const userController = require('../controllers/user_controller');
const itemController = require('../controllers/item_controller');
const orderController = require('../controllers/order_controller');

//Authorisation routes
router.post('/sign-up', userMiddleware.validateRegister, loginController.postSignUp);
router.get("/verify/:userID/:token", loginController.getVerify);
router.post('/login', loginController.postLogin);
router.delete('/logout', loginController.deleteLogout);

//User data routes
router.get('/user/:email', userMiddleware.isLoggedIn, userController.getUserData);
router.patch('/user/:email', userMiddleware.isLoggedIn, userController.updateUserData);

//Menu routes
router.get('/home', itemController.getAllItems);
router.get('/home/:itemID', userMiddleware.isLoggedIn, itemController.getItemByID);
router.patch('/home/:itemID', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.updateItem);
router.post('/home/add', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.addMenuItem);
router.delete('/home/del/:itemID', userMiddleware.isLoggedIn, userMiddleware.isAdmin, itemController.deleteItem);

//Order routes
router.post('/order/:userID',
    /* userMiddleware.isLoggedIn,*/
    orderController.addOrder);
router.patch('/order/status/:orderID', userMiddleware.isLoggedIn, userMiddleware.isAdmin, orderController.changeOrderStatus);
// get orders for a specific user
router.get('/order/:userID', userMiddleware.isLoggedIn, orderController.getUserOrders);
router.get('/orders/:orderID', userMiddleware.isLoggedIn, orderController.getOrder);
router.get('/order/', userMiddleware.isLoggedIn, userMiddleware.isAdmin, orderController.getAllOrders);

router.get('/secret-route', userMiddleware.isLoggedIn, userMiddleware.isAdmin, loginController.getSecretRoute);

module.exports = router;