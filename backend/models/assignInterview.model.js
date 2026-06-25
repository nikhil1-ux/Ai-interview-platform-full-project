import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema(
  {
    InterviewId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
  },
  {
   candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
   {
  status: {
      type: String,
      enum: ["assigned", "in-progress", "completed"],
      default: "assigned",
    },
  }
,
{timestamps: true})

export const Assignment = mongoose.model("Assignment", assignmentSchema);
