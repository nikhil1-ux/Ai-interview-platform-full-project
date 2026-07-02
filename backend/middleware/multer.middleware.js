import multer from "multer";
import path from "path";
import fs from "fs";
import ApiError from "../utils/ApiError.js";

const UPLOAD_DIR = "uploads/resumes";

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user._id}-${Date.now()}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only PDF and DOCX resumes are supported"),
      false
    );
  }
  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});