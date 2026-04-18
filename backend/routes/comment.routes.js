// backend/routes/comment.routes.js
const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const router = express.Router();

// GET /api/comments/:postId - Public: all comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name profilePic')
      .populate('replies.author', 'name profilePic role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/:postId - Member/Admin: add a comment
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      body: req.body.body
    });
    await comment.populate('author', 'name profilePic');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/:commentId/reply - Reply to a comment
router.post('/:commentId/reply', protect, memberOrAdmin, async (req, res) => {
  try {
    const { body } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Get the post to check if user is author
    const post = await Post.findById(comment.post);
    
    // Check if user is admin OR post author OR comment author
    const isAdmin = req.user.role === 'admin';
    const isPostAuthor = post.author.toString() === req.user._id.toString();
    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    
    if (!isAdmin && !isPostAuthor && !isCommentAuthor) {
      return res.status(403).json({ message: 'Not authorized to reply to this comment' });
    }
    
    comment.replies.push({
      author: req.user._id,
      body: body
    });
    
    await comment.save();
    await comment.populate('replies.author', 'name profilePic role');
    
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:id - Own comment OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:commentId/reply/:replyId - Delete a reply
router.delete('/:commentId/reply/:replyId', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    const reply = comment.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });
    
    const isAdmin = req.user.role === 'admin';
    const isReplyAuthor = reply.author.toString() === req.user._id.toString();
    
    // Get post to check if user is post author
    const post = await Post.findById(comment.post);
    const isPostAuthor = post.author.toString() === req.user._id.toString();
    
    if (!isAdmin && !isPostAuthor && !isReplyAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }
    
    reply.remove();
    await comment.save();
    
    res.json({ message: 'Reply deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;