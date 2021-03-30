const handleAsync = require('./../utils/handleAsync');
const AppError = require('./../utils/AppError');
const Post = require('./../models/postModel');
const User = require('./../models/userModel');

exports.getLoginForm = handleAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login into your account',
  });
});

exports.getSignUpForm = handleAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign up into your account',
  });
});

exports.getMainPage = handleAsync(async (req, res, next) => {
  res.status(200).render('index', {
    title: 'Treach',
  });
});

exports.forgotPage = handleAsync(async (req, res, next) => {
  res.status(200).render('forgot', {
    title: 'Forgot Password',
  });
});

exports.getResetPasswordForm = (req, res) => {
  return res.status(200).render('resetpassword', {
    title: 'Reset Your Password ',
    resetToken: req.params.resetToken,
  });
};

//handler factory
exports.getMe = (req, res) => {
  return res.status(200).render('profile', {
    title: 'Update Profile Info',
    user: req.user,
  });
};

exports.forumPage = handleAsync(async (req, res) => {
  const posts = await Post.find();

  return res.status(200).render('forum', {
    title: 'Forum Page',
    posts,
  });
});

exports.getPost = handleAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const post = await Post.findOne({ slug: req.params.slug }).populate({
    path: 'User',
    fields: 'fname user',
  });
  
  const paragraph = post.summary.split('\n')
  

  if (!post) {
    return next(new AppError('There is no post with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('post', {
    title: `${post.title} Tour`,
    post,
    paragraph
  });
});
