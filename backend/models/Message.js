// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['unread', 'read', 'replied'], 
    default: 'unread' 
  },
  reply: { type: String, default: '' },
  repliedAt: { type: Date },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);