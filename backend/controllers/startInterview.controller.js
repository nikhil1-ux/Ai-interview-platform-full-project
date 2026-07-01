import crypto from "crypto";

import { Assignment } from "../models/assignInterview.model.js";
import { InterviewSession } from "../models/interviewSession.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const startInterview = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const candidateId = req.user._id;

  // Find assignment with interview details
  const assignment = await Assignment.findById(assignmentId).populate(
    "interviewId",
    "title company duration questions jobRole description skills"
  );

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  // Authorization
  if (!assignment.candidateId.equals(candidateId)) {
    throw new ApiError(
      403,
      "You are not authorized to start this interview."
    );
  }

  if (!assignment.interviewId) {
    throw new ApiError(404, "Interview not found.");
  }

  // Check if session already exists
  let session = await InterviewSession.findOne({
    assignmentId: assignment._id,
  });

  // If interview already completed
  if (session && session.status === "completed") {
    throw new ApiError(
      403,
      "This interview has already been completed."
    );
  }

  // Create session only once
  if (!session) {
    session = await InterviewSession.create({
      assignmentId: assignment._id,
      candidateId: assignment.candidateId,
      interviewId: assignment.interviewId._id,

      sessionToken: crypto.randomUUID(),

      status: "started",

      totalQuestions: assignment.interviewId.questions,

      currentQuestionIndex: 0,
      questionsAnswered: 0,

      responses: [],

      activeSocketId: null,
      isConnected: false,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sessionId: session.sessionToken,

        interviewId: assignment.interviewId._id,

        interviewTitle: assignment.interviewId.title,

        company: assignment.interviewId.company,

        duration: assignment.interviewId.duration,

        totalQuestions: assignment.interviewId.questions,

        status: session.status,
      },
      "Interview session is ready."
    )
  );
});

