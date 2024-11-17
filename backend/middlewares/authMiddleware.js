import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Post from "../models/Post.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, Invalid token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, No token");
  }
});

const isSuperAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isSuperAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
});

// check ownership for user profiles
const checkUserOwnership = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // The ID of the user being accessed
  if (id !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to access this resource");
  }
  next();
});

// check ownership for posts
const checkPostOwnership = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // The ID of the post being accessed
  const post = await Post.findById(id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to access this resource");
  }

  // Attach the post to the request object for further processing
  req.post = post;
  next();
});

export {
  isAuthenticated,
  isSuperAdmin,
  checkUserOwnership,
  checkPostOwnership,
};
