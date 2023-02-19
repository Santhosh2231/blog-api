const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate requests using a JSON Web Token (JWT)
exports.authenticate = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    // const authHeader = req.headers.authorization;
    // const token = authHeader.split(' ')[1];

    // but for API sending directly
    const token = req.body.token;

    // Verify the token and get the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the user by ID and attach it to the request object
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};
