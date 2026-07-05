import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // assignInterview.model.js
status: {
  type: String,
  enum: ["assigned", "accepted", "rejected", "in-progress", "completed"],
  default: "assigned",
},

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);