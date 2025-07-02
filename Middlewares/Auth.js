const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(401).json({ success: false, message: 'No auth provided' });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  }

    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}   

module.exports = ensureAuthenticated;