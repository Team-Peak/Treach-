const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logOut);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);
router.route('/').get(authController.protect, authController.getAllUsers);

module.exports = router;
