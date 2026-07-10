import { Interview } from "../models/interview.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Assignment } from "../models/assignInterview.model.js";
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { sendEmail } from "../utils/sendEmail.js";
import { InterviewSession } from "../models/interviewSession.model.js";


export const createAndAssignInterviews = asyncHandler(async(req,res)=>{

  console.log("=== CREATE INTERVIEW DEBUG ===");
  console.log("Request body:", req.body);

  const {title, email} = req.body;

  // Step 1: Create Interview
  const interview = await Interview.create({
    ...req.body,
    createdBy: req.user._id,
  });
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

  // Respond immediately — don't make the client wait on email delivery
  res.status(201).json(
    new ApiResponse(200,
      {
        interview,
        assignment,
      },
      "Interview created, assigned and email sent"
    )
  );

  // Fire the email in the background; failures here should never break the request
  sendEmail({
    to: candidate.email,
    subject: "Interview Invitation",
    html: `
      <h2>Hello ${candidate.name}</h2>

      <p>Your interview has been scheduled.</p>

      <p>Role: ${interview.jobRole}</p>

      <p>Duration: ${interview.duration} mins</p>
    `,
  }).catch((err) => {
    console.error("Failed to send interview invitation email:", err.message);
  });
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

// ---------------------------------------------------------------------------
// RECRUITER: edit an interview's info (title, company, jobRole, description,
// skills, questions, duration). Candidate assignments are left untouched.
// ---------------------------------------------------------------------------
export const updateInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const interview = await Interview.findById(id);
  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (String(interview.createdBy) !== String(req.user._id)) {
    throw new ApiError(403, "You are not allowed to edit this interview");
  }

  const editableFields = [
    "title",
    "company",
    "jobRole",
    "description",
    "skills",
    "questions",
    "duration",
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      interview[field] = req.body[field];
    }
  });

  await interview.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { interview }, "Interview updated"));
});

// ---------------------------------------------------------------------------
// RECRUITER: delete an interview, along with every candidate assignment and
// in-progress/completed session tied to it.
// ---------------------------------------------------------------------------
export const deleteInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const interview = await Interview.findById(id);
  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (String(interview.createdBy) !== String(req.user._id)) {
    throw new ApiError(403, "You are not allowed to delete this interview");
  }

  await Assignment.deleteMany({ interviewId: id });
  await InterviewSession.deleteMany({ interviewId: id });
  await Interview.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { interviewId: id }, "Interview deleted"));
});