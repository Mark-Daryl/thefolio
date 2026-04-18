// backend/routes/password.routes.js
const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    
    // For security, don't reveal if email exists or not
    if (!user) {
      return res.status(200).json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    
    // For now, log the reset link (in production, send via email)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    console.log('Password reset link:', resetLink);
    
    // In a real app, send email here
    // For development, return the reset link (remove in production)
    res.status(200).json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Verify reset token
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }
    
    res.status(200).json({ message: 'Token is valid', email: user.email });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide both password fields' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }
    
    // Update password - pre-save hook will hash it
    user.password = password;
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null;
    await user.save();
    
    res.status(200).json({ message: 'Password has been reset successfully!' });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;