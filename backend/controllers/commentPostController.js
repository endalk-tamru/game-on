import asyncHandler from "express-async-handler";

import Comment from "../models/CommentPost.js";
import Post from "../models/Post.js";

// @desc   Create a new comment
// @route  POST /api/comments/:postId
// @access Private - Logged In User
const addComment = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Content is required.");
  }

  // Check if the post exists
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    user: req.user._id,
    post: postId,
    content,
  });

  if (comment) {
    res.status(201).json(comment);
  } else {
    res.status(500);
    throw new Error("Server Error: Comment is not created.");
  }
});

// @desc   Get all comments for a post
// @route  GET /api/comments/:postId
// @access Public
const getComments = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;

  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "name email"
  );

  if (comments) {
    res.status(200).json(comments);
  } else {
    res.status(404);
    throw new Error("No comments found for this post");
  }
});

export { addComment, getComments };
