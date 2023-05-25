import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.auth;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(400);
      throw new Error("Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token is required");
  }
});

export { protect };
