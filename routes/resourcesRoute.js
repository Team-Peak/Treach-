const express = require('express');
const router = express.Router();

const resourceController = require('../controllers/resourcesController');
const authController = require('./../controllers/authController');

router.use(authController.protect);
router
  .route('/')
  .post(
    resourceController.setIDs,
    resourceController.uploadResources,
    resourceController.createresource
  );

module.exports = router;
