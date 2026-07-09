import express from "express";
 
import {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  updateProfile,
} from "../controllers/auth.controller.js";

import {
  getMyResults,
  getRanking,
  getRecruiterStats,
  getRecruiterInterviews,
  getRecruiterResults,
} from "../controllers/dashboard.controller.js";
 
import { verifyJWT } from "../middleware/auth.middleware.js";
 
import {
  createAndAssignInterviews,
  getMyInterview,
  updateInterview,
  deleteInterview,
} from "../controllers/interview.controller.js";
 
import {
  startInterview
}
   from "../controllers/startInterview.controller.js"
 
import uploadResumeController  from "../controllers/resume.controller.js";
import  uploadResume  from "../middleware/multer.middleware.js";
 
const router = express.Router();
 
// Public routes
router.post("/signup", registerUser);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
 
// Interview routes
router.post("/create", verifyJWT, createAndAssignInterviews);
router.get("/my-interviews", verifyJWT, getMyInterview);
router.post("/assignment/:id/start",verifyJWT,startInterview);
router.patch("/recruiter/interviews/:id", verifyJWT, updateInterview);
router.delete("/recruiter/interviews/:id", verifyJWT, deleteInterview);
 
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
router.patch("/update-profile", verifyJWT, updateProfile);

// Dashboard routes
router.get("/my-results", verifyJWT, getMyResults);
router.get("/ranking", verifyJWT, getRanking);
router.get("/recruiter/stats", verifyJWT, getRecruiterStats);
router.get("/recruiter/interviews", verifyJWT, getRecruiterInterviews);
router.get("/recruiter/results", verifyJWT, getRecruiterResults);

export default router;