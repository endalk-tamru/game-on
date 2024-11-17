import express from "express";

import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addComment,
  getComments,
} from "../controllers/commentPostController.js";

const router = express.Router();

router
  .route("/:id")
  .post(isAuthenticated, addComment)
  .get(isAuthenticated, getComments);

export default router;
