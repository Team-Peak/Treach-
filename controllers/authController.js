const User = require('./../models/userModel');
const handleAsync = require('./../utils/handleAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES
  });
  return token;
};

const sendJWT = (user, statusCode, res) => {
  const token = signToken(user._id);
  //send jwt to browser using cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //in production send only a secure cookie
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};
exports.signUp = handleAsync(async (req, res, next) => {
  //add user to database
  const user = await User.create(req.body);
  //create a jwt
  sendJWT(user, 200, res);
});

exports.login = handleAsync(async (req, res, next) => {
  //get user based on email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please input your email or password'));
  }

  const user = await User.findOne({ email }).select('+password');

  //check if user exists and password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password'));
  }
  //generate jwt
  sendJWT(user, 200, res);
});

exports.forgotPassword = handleAsync(async (req, res, next) => {
  //take email and check if user exists
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please input email to reset password'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Your email is not registered with our service'));
  }
  //create reset token
  const resetToken = await user.createResetPassword();
  await user.save();

  //send reset token to email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `Forgot password . click here ${resetUrl}`;
  const subject = 'Password Reset Token (Expires in 10 minutes)';

  await sendEmail({
    email,
    subject,
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'reset token sent to email',
  });
});

exports.resetPassword = handleAsync(async (req, res, next) => {
  //get reset token

  //check for user using token
  const hashedToken = await crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //change the password
  if (!user) {
    return next(new AppError('token is invalid or expired', 401));
  }

  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  //save changes
  await user.save({
    runValidators: true,
  });

  //create jwt
  const token = signToken(user._Id);
  res.status(200).json({
    status: 'success',
    token,
    message: 'password reset was successful',
  });
});

//authorization middleware
exports.protect = handleAsync(async (req, res, next) => {
  //check for token

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //verify token
  if (!token || !(await jwt.verify(token, process.env.JWT_SECRET))) {
    return next(new AppError('TOKEN IS INVALID OR EXPIRED .PLEASE LOGIN', 401));
  }
  //check if user exists
  //check if password was changed
  next();
});

exports.getAllUsers = handleAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    users,
  });
});
