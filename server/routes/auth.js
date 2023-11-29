const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateUser } = require('../middleware');
// require('dotenv').config()
require('dotenv-flow').config();
// Register
router.post('/register', async (req, res) => {
  // Implement user registration logic here
  const { username, role, password } = req.body;

  try {
    // Validate required fields
    if (!username || !role || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  // Implement user login logic here
  const { username, password } = req.body;

  try {
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("jwtoken",process.env.JWT_SECRET)
    // If credentials are valid, create a token for authentication
    const token = jwt.sign({ userId: user._id, userType: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });

    // Respond with the token
    res.status(200).json({ "token" :token, "role":user.role});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Profile (protected route)
router.get('/profile', authenticateUser, async (req, res) => {
  // Return user profile
  try {
    // The user information is available in req.user due to the authenticateUser middleware
    const userId = req.user.userId;

    // Retrieve the user profile from the database
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Return the user profile
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
