const handleAsync = require('./../utils/handleAsync');
const AppError = require('./../utils/AppError');

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

exports.forumPage = (req,res) =>{
  return res.status(200).render('forum',{
    title:'Forum Page'
  })


}