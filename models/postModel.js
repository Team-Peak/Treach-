const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please input a title'],
      trim: true,
    },
    slug: String,
    images: [{
      type:String,
      default:'default.jpg'
    }],
    summary: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'fname ',
  });
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
