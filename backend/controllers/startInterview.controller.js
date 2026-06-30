import { Assignment } from "../models/assignInterview.model.js";
import { Interview } from "../models/interview.model.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const startInterview = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const userId = req.user._id;

  // ✅ Fetch with populate for related data
  const assignment = await Assignment.findById(assignmentId).populate(
    "interviewId"
  );

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  // ✅ Clear authorization check
  if (!assignment.candidateId.equals(userId)) {
    throw new ApiError(
      403,
      "You are not authorized to start this interview"
    );
  }

  // ✅ Validate interview exists
  if (!assignment.interviewId) {
    throw new ApiError(404, "Interview not found");
  }

  // ✅ Return error for completed interviews
  if (assignment.status === "completed") {
    throw new ApiError(
      403,
      "This interview has already been completed. You cannot start it again."
    );
  }

  // ✅ Update status
  assignment.status = "in-progress";
  await assignment.save();

  const sessionId = crypto.randomUUID();

  // ✅ Fixed syntax and proper response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sessionId,
        interviewId: assignment.interviewId._id,
        interviewTitle: assignment.interviewId.title,
        company: assignment.interviewId.company,
        duration: assignment.interviewId.duration,
      },
      "Interview started successfully"
    )
  );
});