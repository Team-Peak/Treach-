const express = require('express');
const router = express.Router();

const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.use(authController.protect);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.setPostUserIds,
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
