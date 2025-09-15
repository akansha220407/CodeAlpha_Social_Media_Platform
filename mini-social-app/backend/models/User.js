const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }]
}, { timestamps: true });

module.exports = mongoose.model('User ', UserSchema);
