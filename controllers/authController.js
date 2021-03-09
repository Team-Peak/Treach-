const User = require('./../models/userModel');
const handleAsync = require('./../utils/handleAsync');
const jwt = require('jsonwebtoken');

exports.signUp = handleAsync(async (req, res, next) => {
  //add user to database
  const user = await User.create(req.body);

  //create a jwt
  await jwt.sign(user.id, process.env.JWT_SECRET);
  console.log(jwt);
});
