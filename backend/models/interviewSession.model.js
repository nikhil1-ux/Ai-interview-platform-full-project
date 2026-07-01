import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    topic: {
      type: String,
      default: "General",
    },

    answer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    timeTaken: {
      type: Number, // seconds
      default: 0,
    },

    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    technicalScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },

    problemSolvingScore: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: [String],

    weaknesses: [String],

    recommendation: {
      type: String,
      enum: ["Reject", "Consider", "Hire"],
      default: "Consider",
    },

    summary: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const cheatingSchema = new mongoose.Schema(
  {
    type: String,

    description: String,

    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

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

    sessionToken: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "started",
        "in-progress",
        "paused",
        "completed",
        "abandoned",
      ],
      default: "started",
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
      type: Number, // minutes
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    questionsAnswered: {
      type: Number,
      default: 0,
    },

    responses: [responseSchema],

    finalReport: reportSchema,

    cheatingFlags: [cheatingSchema],

    activeSocketId: {
      type: String,
      default: null,
    },

    isConnected: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One interview session per assignment
interviewSessionSchema.index(
  {
    assignmentId: 1,
    candidateId: 1,
  },
  {
    unique: true,
  }
);


interviewSessionSchema.index({ candidateId: 1 });
interviewSessionSchema.index({ interviewId: 1 });
interviewSessionSchema.index({ status: 1 });

export const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);