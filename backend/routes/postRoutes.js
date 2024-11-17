import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import {
  checkPostOwnership,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, upload.single("video"), createPost)
  .get(getPosts);

router
  .route("/:id")
  .get(isAuthenticated, getPostById)
  .put(isAuthenticated, checkPostOwnership, upload.single("video"), updatePost)
  .delete(isAuthenticated, checkPostOwnership, deletePost);

export default router;
