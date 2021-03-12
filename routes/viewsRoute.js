const app = require('./../app');
const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const viewsController = require('./../controllers/viewController');

router.use(authController.isLoggedin);

router.route('/').get(viewsController.getMainPage);
router.route('/login').get(viewsController.getLoginForm);
router.route('/signup').get(viewsController.getSignUpForm);

module.exports = router;
