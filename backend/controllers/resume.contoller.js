import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { extractResumeText } from "../services/resume.service.js";
import User from "../models/user.model.js";

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // 1. Upload the raw file to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      public_id: `resume_${req.user._id}_${Date.now()}`,
    });

    // 2. Extract text (pdf-parse / mammoth) for AI use
    const resumeText = await extractResumeText(
      req.file.buffer,
      req.file.mimetype
    );

    // 3. Save URL + parsed text to the user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeUrl: result.secure_url,
        resumeText,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: user.resumeUrl,
    });
  } catch (err) {
    console.error("Resume upload error:", err);

    res.status(500).json({
      message: "Resume upload failed",
      error: err.message,
    });
  }
};

export default { uploadResume };