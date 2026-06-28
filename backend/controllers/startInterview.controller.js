import { Assignment } from "../models/assignment.model.js";
import { Interview } from "../models/interview.model.js";
import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const startInterview = asyncHandler( async(req,res)=>{

 const assignmentId = req.params.id;

 const assignment = await Assignment.findById(assignmentId)

 if(!assignment){
  throw new ApiError(
    404,
    "Assignment not found",
 )
 }

  if (!assignment.candidateId.equals(req.user._id)){
    throw new ApiError(
      403,
      "not allowed "
    )
  }

   if (assignment.status === "completed"){
    
    return res
    .status(200)
    .json(new ApiResponse(200,"Interview already completed"))
   }


  assignment.status = "in-progress";
  await assignment.save();

    const interview = await Interview.findById(assignment.interviewId);

      if (!interview) {
        throw new ApiError(
          404,
           "Interview not found",

        )
      }
     const sessionId = crypto.randomUUID();
      
     return res.status(200
      .json(
        new ApiResponse(
        200,
        {
        interview,
        sessionId
      },
        
        " Soon interview will be started"
    )
      )
     )
      })