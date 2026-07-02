import fs from "fs";
 
import { User } from "../models/user.model.js";
import { extractResumeText } from "../service/resume.service.js";
 
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
 
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No resume file uploaded");
  }
 
  const { path: filePath, mimetype } = req.file;
 
  let resumeText;
 
  try {
    resumeText = await extractResumeText(filePath, mimetype);
  } catch (error) {
    // Clean up the stored file if extraction failed, so we don't
    // accumulate unusable uploads on disk.
    fs.unlink(filePath, () => {});
    throw new ApiError(422, error.message);
  }
 
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      resumeUrl: filePath,
      resumeText,
    },
    { new: true }
  );
 
  if (!user) {
    throw new ApiError(404, "User not found");
  }
 
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resumeUrl: user.resumeUrl,
        resumeTextPreview: resumeText.slice(0, 300),
      },
      "Resume uploaded and parsed successfully"
    )
  );
});