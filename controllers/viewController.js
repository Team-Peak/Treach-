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