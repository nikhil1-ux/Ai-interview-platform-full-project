import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password , role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Create user (password is auto-hashed by pre-save hook)
  const user = await User.create({ name, email, password,role  });

  // Generate tokens using model method
  const { accessToken, refreshToken } = user.generateTokens();

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        accessToken,
        user: user.toJSON(), // Password automatically hidden
      },
      "User registered successfully"
    )
  );
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
    
  }
    const { accessToken, refreshToken } = user.generateTokens();

  // store refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // send refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

 return res.status(200).json(
  new ApiResponse(200, {accessToken,user: user.toJSON() }, "User logged in successfully")
);
});



// auth.controller.js — logout now actually invalidates it in the DB
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie("refreshToken");
  return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (refreshToken !== user.refreshToken) {
  throw new ApiError(401, "Refresh token expired or reused");
}

    // Generate new tokens using model method
    const { accessToken, refreshToken: newRefreshToken } = user.generateTokens();

    user.refreshToken = newRefreshToken;
await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(200, { accessToken }, "Token refreshed successfully")
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});


export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, user.toJSON(), "User fetched successfully")
  );
});