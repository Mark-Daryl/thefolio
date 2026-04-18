// backend/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true },
  // Add replies to comments
  replies: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);