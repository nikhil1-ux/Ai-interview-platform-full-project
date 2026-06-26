import { Interview } from "../models/interview.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Assignment } from "../models/assignInterview.model.js";
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/sendEmail.js";


export const createAndAssignInterviews = asyncHandler(async(req,res)=>{

  console.log("=== CREATE INTERVIEW DEBUG ===");
  console.log("Request body:", req.body);

  const {title, email} = req.body;

  // Step 1: Create Interview
  const interview = await Interview.create(req.body);
  console.log("Interview created:", interview._id);

  // Step 2: Find Candidate
  const candidate = await User.findOne({email});
  console.log("Candidate found:", candidate?._id, "Email:", candidate?.email);

  if (!candidate){
    throw new ApiError(401, "candidate not found in database")
  }

  

  let assignment = await Assignment.create({
    interviewId: interview._id,
    candidateId: candidate._id,
  });

await sendEmail({
  to: candidate.email,
  subject: "Interview Invitation",
  html: `
    <h2>Hello ${candidate.name}</h2>

    <p>Your interview has been scheduled.</p>

    <p>Role: ${interview.role}</p>

    <p>Duration: ${interview.duration} mins</p>
  `,
});
 

  return res.status(201).json(
    new ApiResponse(200,
      {
        interview,
        assignment,
      },
      "Interview created, assigned and email sent"
    )
  )
});

export const getMyInterview = asyncHandler(async (req,res)=>{

  const userId = req.user._id;


  // Fetch from database with population
  const assignments = await Assignment.find({ candidateId: userId })
    .populate("interviewId")
    .populate("candidateId");

   
  

  return res.status(200).json(
    new ApiResponse(
      200,
      {assignments},
      "interviews fetched"
    )
  );
});