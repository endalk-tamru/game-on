import asyncHandler from "express-async-handler";

import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

// @desc   Update user profile
// @route  PUT /api/users/:id
// @access Private - Authorized user
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let profileImgDetails = user.profileImg;

  if (req.file) {
    try {
      // Delete the existing video from Cloudinary if it exists
      if (profileImgDetails?.cloudinary_public_id) {
        await cloudinary.uploader.destroy(
          profileImgDetails.cloudinary_public_id
        );
      }

      // Upload the new profile image to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: `${req.user.id}`,
        upload_preset: "users_profile",
      });

      profileImgDetails = {
        cloudinary_public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary image upload error:", error);
      res.status(500);
      throw new Error("Failed to upload profile image");
    }
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.gender = req.body.gender || user.gender;
  user.primarySport = req.body.primarySport || user.primarySport;
  user.primaryPositionRole =
    req.body.primaryPositionRole || user.primaryPositionRole;
  user.height = req.body.height || user.height;
  user.weight = req.body.weight || user.weight;
  user.dominantHandFoot = req.body.dominantHandFoot || user.dominantHandFoot;
  user.bio = req.body.bio || user.bio;
  user.profileImg = profileImgDetails;

  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(500);
    throw new Error("Server Error: User profile is not updated.");
  }
};

// @desc   Get all users profile
// @route  GET /api/users
// @access Private - LoggedIn users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

// @desc   Get single user profile
// @route  GET /api/users/:id
// @access Private - LoggedIn users
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
};

// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private - Authorized user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.profileImg?.cloudinary_public_id) {
    try {
      await cloudinary.uploader.destroy(user.profileImg.cloudinary_public_id);
    } catch (error) {
      console.error(`Cloudinary deletion error: ${error.message}`);
    }
  }

  const deletedUser = await User.deleteOne(user);

  if (deletedUser) {
    res.status(200).json({ message: "User Deleted." });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

export { getUsers, getUserById, updateUser, deleteUser };
