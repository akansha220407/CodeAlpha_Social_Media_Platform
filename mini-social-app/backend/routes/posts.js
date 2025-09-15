const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret';

// Middleware to authenticate
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Create a post
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });

  const post = new Post({ author: req.userId, content });
  await post.save();
  res.json(post);
});

// Get all posts (with author info, comments)
router.get('/', async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'username')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'username' }
    });
  res.json(posts);
});

// Like/unlike a post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const userId = req.userId;
  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter(id => !id.equals(userId));
  } else {
    post.likes.push(userId);
  }
  await post.save();
  res.json({ likesCount: post.likes.length });
});

// Add comment to post
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = new Comment({ author: req.userId, post: post._id, content });
  await comment.save();

  post.comments.push(comment._id);
  await post.save();

  const populatedComment = await comment.populate('author', 'username');
  res.json(populatedComment);
});

module.exports = router;
