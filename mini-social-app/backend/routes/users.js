const express = require('express');
const router = express.Router();
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

// Get user profile by username
router.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select('-passwordHash')
    .populate('followers', 'username')
    .populate('following', 'username');
  if (!user) return res.status(404).json({ message: 'User  not found' });
  res.json(user);
});

// Follow user
router.post('/:username/follow', authMiddleware, async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

  const userToFollow = await User.findOne({ username: req.params.username });
  if (!userToFollow) return res.status(404).json({ message: 'User  not found' });

  if (userToFollow._id.equals(req.userId)) return res.status(400).json({ message: 'Cannot follow yourself' });

  const currentUser  = await User.findById(req.userId);

  if (!currentUser .following.includes(userToFollow._id)) {
    currentUser .following.push(userToFollow._id);
    userToFollow.followers.push(currentUser ._id);
    await currentUser .save();
    await userToFollow.save();
  }

  res.json({ message: `Followed ${userToFollow.username}` });
});

// Unfollow user
router.post('/:username/unfollow', authMiddleware, async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

  const userToUnfollow = await User.findOne({ username: req.params.username });
  if (!userToUnfollow) return res.status(404).json({ message: 'User  not found' });

  const currentUser  = await User.findById(req.userId);

  currentUser .following = currentUser .following.filter(id => !id.equals(userToUnfollow._id));
  userToUnfollow.followers = userToUnfollow.followers.filter(id => !id.equals(currentUser ._id));

  await currentUser .save();
  await userToUnfollow.save();

  res.json({ message: `Unfollowed ${userToUnfollow.username}` });
});

module.exports = router;
