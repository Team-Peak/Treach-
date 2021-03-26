const app = require('./../app');
const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const viewsController = require('./../controllers/viewController');
const userController = require('../controllers/userController')
//check if someone is logged in
router.use(authController.isLoggedin);

router.route('/').get(viewsController.getMainPage);
router.route('/login').get(viewsController.getLoginForm);
router.get('/forgotpassword', viewsController.forgotPage);

router.get('/api/v1/users/resetpassword/:resetToken', viewsController.getResetPasswordForm);

router.get('/me',userController.getMe,viewsController.getMe)
router.route('/signup').get(viewsController.getSignUpForm);

module.exports = router;
