
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sendConfirmationEmail } = require('../utils/email');

const router = express.Router();

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Create confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    // Create new user
    const user = new User({
      email,
      password,
      name,
      confirmationToken
    });
    
    await user.save();
    
    // Send confirmation email
    await sendConfirmationEmail(email, confirmationToken);
    
    res.status(201).json({ 
      message: 'Account created! Please check your email to confirm your account before logging in.' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check if email is confirmed
    if (!user.emailConfirmed) {
      return res.status(401).json({ 
        error: 'Email not confirmed',
        needsConfirmation: true 
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Confirm email
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with token
    const user = await User.findOne({ confirmationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid confirmation token' });
    }
    
    // Update user to confirmed
    user.emailConfirmed = true;
    user.confirmationToken = undefined;
    await user.save();
    
    res.json({ message: 'Email confirmed successfully! You can now log in.' });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm email' });
  }
});

// Resend confirmation email
router.post('/resend-confirmation', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.emailConfirmed) {
      return res.status(400).json({ error: 'Email already confirmed' });
    }
    
    // Generate new token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    user.confirmationToken = confirmationToken;
    await user.save();
    
    // Send confirmation email
    await sendConfirmationEmail(email, confirmationToken);
    
    res.json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Resend confirmation error:', error);
    res.status(500).json({ error: 'Failed to resend confirmation email' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -confirmationToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Logout (client-side only, just for API completeness)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
