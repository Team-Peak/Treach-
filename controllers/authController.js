const User = require('./../models/userModel');
const handleAsync = require('./../utils/handleAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
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
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    fname: req.body.fname,
    lname: req.body.lname,
  });
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
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot password . click here ${resetUrl}`;
  const subject = 'Password Reset Token (Expires in 10 minutes)';

  try {
    await sendEmail({
      email,
      subject,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'reset token sent to email',
    });
  } catch (err) {
    res.status(500).json({
      message: 'There was an error sending the reset token',
    });
  }
});

exports.resetPassword = handleAsync(async (req, res, next) => {
  //check for password and password confirm
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('Please input your new Password'));
  }
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  sendJWT(user, 201, res);
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in , Please login to access this service',
        401
      )
    );
  }
  //verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  //check if user exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exists',
        401
      )
    );
  }

  //check if password was changed
  if (user.passwordChangedAfter()) {
    return next(
      new AppError('User recently changed password! Please login', 401)
    );
  }

  //grant access
  req.user = user;
  res.locals.user = user;
  next();
});

exports.isLoggedin = async (req, res, next) => {
  try {
    //check for token

    if (req.cookies.jwt) {
      if (!req.cookies.jwt) {
        return next();
      }
      //verify token
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      //check if user exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return next();
      }

      //check if password was changed
      if (user.passwordChangedAfter()) {
        return next();
      }
      //grant access
      res.locals.user = user;
      return next();
    }

    next();
  } catch (err) {
    return next();
  }
};

exports.logOut = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.getAllUsers = handleAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    users,
  });
});
