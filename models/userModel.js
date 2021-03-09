const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please input your name'],
    min: [3, 'Minimum length of your name should be 3 '],
    max: [10, 'Maximum length of your name should be 10'],
  },
  email: {
    type: String,
    required: [true, 'Please input your email'],
    validate: [validator.isEmail, 'Please input correct email address'],
    unique: true,
  },
  image: String,
  slug: String,
  password: {
    type: String,
    select: false,
    minlength: [8, 'password requires minimum of 8 character'],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password; //password confirm should be equal to the user password
      },
      message: 'The password does not match',
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  premium: {
    type: Boolean,
    default: false,
  },
  levelOfTeaching: {
    type: String,
    enum: ['0 level', 'A level', ' Undagraduate level'],
    default: '0 level',
    required: [true, 'Please input your level of teaching'],
  },
  areaOfIntrest: [Array],
});

//document middleware to create a name slug //works on save and create only
userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//encrypt password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.createResetPassword = async function () {
  const resetToken = await crypto.randomBytes(6).toString('hex');
  this.passwordResetToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};
userSchema.methods.correctPassword = async function (candidate, userpassword) {
  return await bcrypt.compare(candidate, userpassword);
};
//create and export a model based on schema
const User = mongoose.model('User', userSchema);

module.exports = User;
