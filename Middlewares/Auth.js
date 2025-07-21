const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token expires at:", new Date(decoded.exp * 1000));

    // req.userId = decoded.userId;
    req.userId = decoded.userId || decoded.id || decoded._id;
    if (!req.userId) {
      return res.status(401).json({ message: 'Invalid token payload: no user id' });
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
}; 