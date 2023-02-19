const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');


// Register user
const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation failed', 422, errors.array()));
  }

  const { name, email, password } = req.body;
  console.log(req.body);

  try {

    let user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return next(new ErrorResponse('User already exists', 422));
    }

    // Encrypting password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

 
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    console.log(newUser);

    await newUser.save();

    console.log("SAjbsj");
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    // console.log(err.message);
    return next(new ErrorResponse('Registration failed: '+err.message, 500));
  }
};



// Login user
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation failed', 422, errors.array()));
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid email', 401));
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword,user.password);

    // Comparing passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log("SKFNFD");
    console.log(isMatch);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid password', 401));
    }

    // JWT token
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(token)

    res.status(200).json({
      token,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.log(err)
    return next(new ErrorResponse('Login failed', 500, err));
  }
};

module.exports = {
  register,
  login,
};
