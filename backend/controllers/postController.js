import asyncHandler from "express-async-handler";

import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";

// @desc   Create a new post
// @route  POST /api/post
// @access Private - Logged In User
const createPost = asyncHandler(async (req, res) => {
  const { title, caption } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required.");
  }

  let videoDetails = null;

  if (req.file) {
    try {
      const uploadedVideo = await cloudinary.uploader.upload(req.file.path, {
        folder: `${req.user.id}`,
        upload_preset: "posts_video",
        resource_type: "video",
      });

      videoDetails = {
        cloudinary_public_id: uploadedVideo.public_id,
        url: uploadedVideo.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary video upload error:", error);
      res.status(500);
      throw new Error("Failed to upload video");
    }
  }

  const post = await Post.create({
    user: req.user._id,
    title,
    caption,
    video: videoDetails,
  });

  if (post) {
    res.status(201).json(post);
  } else {
    res.status(400);
    throw new Error("Invalid post data");
  }
});

// @desc   Update post
// @route  PUT /api/post/:id
// @access Private - Authorized user
const updatePost = asyncHandler(async (req, res) => {
  const post = req.post;

  let videoDetails = post.video;

  if (req.file) {
    try {
      // Delete the existing video from Cloudinary if it exists
      if (videoDetails?.cloudinary_public_id) {
        await cloudinary.uploader.destroy(videoDetails.cloudinary_public_id, {
          resource_type: "video",
        });
      }

      // Upload the new video to Cloudinary
      const uploadedVideo = await cloudinary.uploader.upload(req.file.path, {
        folder: `${req.user.id}`,
        upload_preset: "posts_video",
        resource_type: "video",
      });

      videoDetails = {
        cloudinary_public_id: uploadedVideo.public_id,
        url: uploadedVideo.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary video upload error:", error);
      res.status(500);
      throw new Error("Failed to upload new video");
    }
  }

  post.title = req.body.title || post.title;
  post.caption = req.body.caption || post.caption;
  post.video = videoDetails;

  const updatedPost = await post.save();

  if (updatedPost) {
    res.status(200).json(updatedPost);
  } else {
    res.status(500);
    throw new Error("Server Error: Post is not updated.");
  }
});

// @desc   Get all posts
// @route  GET /api/post
// @access Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).populate("user", "name email");

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404);
    throw new Error("No posts found.");
  }
});

// @desc   Get single post
// @route  GET /api/post/:id
// @access Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error("Post not found.");
  }
});

// @desc   Delete post
// @route  DELETE /api/post/:id
// @access Private - Authorized user
const deletePost = asyncHandler(async (req, res) => {
  const post = req.post;

  // Delete video from Cloudinary if it exists
  if (post.video?.cloudinary_public_id) {
    try {
      await cloudinary.uploader.destroy(post.video.cloudinary_public_id, {
        resource_type: "video",
      });
    } catch (error) {
      console.error("Cloudinary video deletion error:", error);
    }
  }

  const deletedPost = await Post.deleteOne(req.post);

  if (deletedPost) {
    res.status(200).json({ message: "Post Deleted." });
  } else {
    res.status(404);
    throw new Error("Post not found.");
  }
});

export { createPost, getPosts, getPostById, updatePost, deletePost };
