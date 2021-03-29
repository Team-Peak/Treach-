const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please input a title'],
    maxlength: [5, 'Max length for a title is 5 words'],
    trim: true,
  },
  image: String,
  Summary: {
    type: String,
    required: [true, 'A post requires a discription'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  tag: {
    type: String,
    required: [true, 'A post requires a tag'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A post must be created by a user',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
