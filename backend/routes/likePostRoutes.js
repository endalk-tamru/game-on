import express from "express";

import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { toggleLike, getLikes } from "../controllers/likePostController.js";

const router = express.Router();

router
  .route("/:postId")
  .put(isAuthenticated, toggleLike)
  .get(isAuthenticated, getLikes);

export default router;
