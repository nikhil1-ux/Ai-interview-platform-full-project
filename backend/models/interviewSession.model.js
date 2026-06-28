import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    status: {
      type: String,
      enum: ["started", "in-progress", "paused", "completed", "abandoned"],
      default: "started",
    },

    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number, // in minutes
      default: null,
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    responses: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        answer: String,
        answeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    socketId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);