import express from "express";
import {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

// Protected routes (require token)
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

export default router;