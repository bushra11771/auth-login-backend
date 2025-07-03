const { expression } = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists, you can login'
      });
    }

    const newUser = new UserModel({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

const login = async (req, res) => {
  console.log('login called');
  try {
    console.log('req.body', req.body);
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.log('user', user);
    const errMessage = 'Invalid credentials, please try again';
    
    if (!user) {
      console.log('user not found');
      return res.status(403).json({
        success: false,
        message: errMessage  
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: errMessage
      });
    }

    const JWTtoken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '60s' }
      
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      jwt: JWTtoken,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

module.exports = {
  signup,
  login
};