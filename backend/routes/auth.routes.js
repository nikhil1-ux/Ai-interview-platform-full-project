import express from "express";
 
import {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";
 
import { verifyJWT } from "../middleware/auth.middleware.js";
 
import {
  createAndAssignInterviews,
  getMyInterview,
} from "../controllers/interview.controller.js";
 
import {
  startInterview
}
   from "../controllers/startInterview.controller.js"
 
import uploadResumeController  from "../controllers/resume.controller.js";
import  uploadResume  from "../middleware/upload.middleware.js";
 
const router = express.Router();
 
// Public routes
router.post("/signup", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
 
// Interview routes
router.post("/create", verifyJWT, createAndAssignInterviews);
router.get("/my-interviews", verifyJWT, getMyInterview);
router.post("/assignment/:id/start",verifyJWT,startInterview);
 
// Resume routes
router.post(
  "/resume/upload",
  verifyJWT,
  uploadResume.single("resume"),
  uploadResumeController
);
// Protected user routes
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);
 
export default router;