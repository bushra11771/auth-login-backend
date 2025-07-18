const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find active user
    const user = await User.findOne({ 
      _id: decoded.userId || decoded.id || decoded._id,
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({ error: 'Please authenticate. Account may be deactivated.' });
    }
exports.superAdmin = (req, res, next) => {
  if (req.user?.role?.trim() !== 'superadmin') { 
    return res.status(403).json({ error: 'SuperAdmin access required' });
  }
  next();
};
    // Attach user and token to request
    req.token = token;
    req.user = user;
    next(); 
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const superAdmin = (req, res, next) => {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};

module.exports = { auth, superAdmin };