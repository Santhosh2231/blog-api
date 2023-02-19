const Post = require('../models/Post');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name');
    console.log(posts)
    res.status(200).json({ posts: posts });
  } catch (err) {
    return next(err);
  }
};

// Get a single post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    console.log(post)
    if (!post) {
      return res.json({ message: 'Post not found' });
    }
    res.status(200).json({ post: post });
  } catch (err) {
    return next(err);
  }
};

// Create a new post
exports.createPost = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }

  // NEW POST
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id
    });
    await post.save();

    res.status(201).json({ post: post });
  } catch (err) {
    return next(err);
  }
};

// Update an existing post
exports.updatePost = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.json({ message: 'You are not authorized to edit this post' });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();

    res.status(200).json({ post: post });
  } catch (err) {
    return next(err);
  }
};

// Delete an existing post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.json({ message: 'You are not authorized to delete this post' });
    }

    await post.remove();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    return next(err);
  }
};


exports.likePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.body._id; 

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(new ErrorResponse('Post not found', 404));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      return next(new ErrorResponse('You have already liked this post', 400));
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json({
      message: 'Post liked successfully',
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        likes: post.likes,
      },
    });
  } catch (err) {
    return next(new ErrorResponse('Could not like post', 500, err));
  }
};

exports.reviewPost = async (req, res, next) => {
  try {
    const { content, rating } = req.body;
    const postId = req.params.id;
    const userId = req.body._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newReview = {
      user: userId,
      content,
      rating
    };

    post.reviews.push(newReview);
    await post.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    next(error);
  }
};