const app = require('./../app');
const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const viewsController = require('./../controllers/viewController');
const userController = require('../controllers/userController');
//check if someone is logged in
router.use(authController.isLoggedin);

router.route('/').get(viewsController.getMainPage);
router.route('/login').get(viewsController.getLoginForm);
router.route('/signup').get(viewsController.getSignUpForm);
router.get('/forgotpassword', viewsController.forgotPage);
router.get('/forum', viewsController.forumPage);
router.get(
  '/api/v1/users/resetpassword/:resetToken',
  viewsController.getResetPasswordForm
);
router.get('/posts/:slug', authController.isLoggedin, viewsController.getPost);
router.get('/findjob', viewsController.getJob);

router.get('/me', authController.protect, viewsController.getMe);

module.exports = router;
