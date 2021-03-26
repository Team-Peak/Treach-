const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logOut);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:resetToken').patch(authController.resetPassword);

router.patch(
  '/addphoto',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.patch('/updateme', userController.updateMe);

module.exports = router;
