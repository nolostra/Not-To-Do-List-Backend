const jwt = require('jsonwebtoken');
// require('dotenv').config()
require('dotenv-flow').config();
const authenticateUser = (req, res, next) => {
  // Implement user authentication logic using JWT
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    // console.log("token =>", token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key

    // Add user information to the request for further route handling
    req.user = {
      userId: decoded.userId,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

const checkUserRole = (role) => {
  return (req, res, next) => {
    // Implement logic to check if user has the required role
    const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key

    // Add user information to the request for further route handling
    console.log("decoded userType => ", decoded.userType)
    if(decoded.userType != role){
      return res.status(401).json({ error: 'Unauthorized - Not Valid Role' });
    }
    next();
     // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }

  };
};

module.exports = { authenticateUser, checkUserRole };
