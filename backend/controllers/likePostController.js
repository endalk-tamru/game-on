import asyncHandler from "express-async-handler";

import Like from "../models/LikePost.js";
import Post from "../models/Post.js";

// @desc   Toggle like/unlike on a post
// @route  POST /api/likes/:postId
// @access Private - Logged In User
const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Check if the post exists
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Check if the user already liked the post
  const existingLike = await Like.findOne({ user: req.user._id, post: postId });

  if (existingLike) {
    // If already liked, unlike it
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json({ message: "Post unliked" });
  }

  // Like the post
  const like = new Like({ user: req.user._id, post: postId });
  await like.save();

  res.status(201).json({ message: "Post liked" });
});

// @desc   Get all likes for a post
// @route  POST /api/likes/:postId
// @access Public
const getLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const likes = await Like.find({ post: postId }).populate(
    "user",
    "name email"
  );

  if (likes) {
    res.status(200).json(likes);
  } else {
    res.status(404);
    throw new Error("No likes found for this post");
  }
});

export { toggleLike, getLikes };
