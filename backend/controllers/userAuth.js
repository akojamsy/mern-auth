// @description Auth token
// @router api/auth/user

import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  console.log(user.matchPassword(password));
  if (user && user.matchPassword(password)) {
    generateToken(res, user._id);
    res.status(201).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @description register user
// @router api/users
// @access Public
const registerUser = async (req, res) => {
  const { password, email, name } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: "User already exists" });
  }

  const newUser = new User({
    name,
    email,
    password,
  });
  const user = await newUser.save();
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      message: "Register user successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @description login users
// @router api/users/logout
// @access Public
const logoutUser = (req, res) => {
  res.cookie("auth", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
};

// @description login users
// @router api/users/logout
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user);

  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json(user);
});

// @description login users
// @router api/users/logout
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "updated successful",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  logoutUser,
  updateUserProfile,
  getUserProfile,
  registerUser,
};
