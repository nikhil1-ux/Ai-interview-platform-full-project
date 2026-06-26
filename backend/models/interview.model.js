import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema(
    {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: String,
      required: true,
    },

    questions:{
      type: Number,
    },


    duration:{ 
      type: Number,

    },

    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

 export const Interview = mongoose.model("Interview",interviewSchema)