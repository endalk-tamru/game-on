import asyncHandler from "express-async-handler";

import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

// @desc   Register a new user & get token
// @route  POST /api/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    dateOfBirth,
    gender,
    height,
    weight,
    primarySport,
    primaryPositionRole,
    dominantHandFoot,
    bio,
    agreeToTerms,
    password,
  } = req.body;

  if (!name || !email || !gender || !primarySport || !password) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  // Ensure user agrees to terms
  if (!agreeToTerms) {
    res.status(400);
    throw new Error("You must agree to the terms and conditions.");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    dateOfBirth,
    gender,
    height,
    weight,
    primarySport,
    primaryPositionRole,
    dominantHandFoot,
    bio,
    agreeToTerms,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      primarySport: user.primarySport,
      primaryPositionRole: user.primaryPositionRole,
      dominantHandFoot: user.dominantHandFoot,
      bio: user.bio,
      agreeToTerms: user.agreeToTerms,
      isSuperAdmin: user.isSuperAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc   Authenticate user & get token
// @route  POST /api/auth/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      primarySport: user.primarySport,
      primaryPositionRole: user.primaryPositionRole,
      dominantHandFoot: user.dominantHandFoot,
      bio: user.bio,
      agreeToTerms: user.agreeToTerms,
      isSuperAdmin: user.isSuperAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

export { registerUser, authUser };
