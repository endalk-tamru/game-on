import express from "express";

import {
  checkUserOwnership,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getUsers);

router
  .route("/:id")
  .get(isAuthenticated, getUserById)
  .put(
    isAuthenticated,
    checkUserOwnership,
    upload.single("profileImg"),
    updateUser
  )
  .delete(isAuthenticated, checkUserOwnership, deleteUser);

export default router;
