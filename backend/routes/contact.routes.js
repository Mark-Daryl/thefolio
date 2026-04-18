// backend/routes/contact.routes.js
const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// Public route - Send a message
router.post('/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newMessage = await Message.create({
      name,
      email,
      message,
      status: 'unread'
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - Get all messages
router.get('/messages', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - Get message by ID
router.get('/messages/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - Mark message as read
router.put('/messages/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.status = 'read';
    await message.save();
    
    res.json({ success: true, message: 'Message marked as read', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - Reply to message
router.post('/messages/:id/reply', protect, adminOnly, async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.reply = reply;
    message.status = 'replied';
    message.repliedAt = new Date();
    message.repliedBy = req.user._id;
    await message.save();
    
    res.json({ 
      success: true, 
      message: 'Reply sent successfully',
      data: message
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - Delete message
router.delete('/messages/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - Get unread count
router.get('/messages/unread/count', protect, adminOnly, async (req, res) => {
  try {
    const count = await Message.countDocuments({ status: 'unread' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;