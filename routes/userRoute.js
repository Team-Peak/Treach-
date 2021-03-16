const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logOut);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:resetToken').patch(authController.resetPassword);

module.exports = router;
