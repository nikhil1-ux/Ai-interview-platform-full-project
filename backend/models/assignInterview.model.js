import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema({
  interviewId: { type: ObjectId, ref: "Interview", required: true },
  candidateId: { type: ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["assigned", "in-progress", "completed"],
    default: "assigned"
  },
  // ✅ NEW FIELDS
  sessionId: { type: String, default: null, index: true },
  startedAt: { type: Date, default: null },
  submittedAt: { type: Date, default: null },
  responses: [{
    questionId: ObjectId,
    answer: String,
    submittedAt: Date
  }]
}, { timestamps: true });
export const Assignment = mongoose.model("Assignment", assignmentSchema);