import { Interview } from "../models/interview.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Assignment } from "../models/assignInterview.model.js";
import {User} from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";


export const createAndAssignInterviews = asyncHandler( async(req,res)=>{

  const {title,email} = req.body;

  const interview = await Interview.create(req.body);

  const candidate = await User.findOne({email});

  if (!candidate){
    throw new ApiError(401,"candidate not found in database")
  }

  const assignment = await Assignment.create({
     interviewId: interview._id,
     candidateId: candidate._id,
      }
  )

   return res.status(201).json(
     new ApiResponse(200,
    {
      interview,
      assignment,
    },
     "Interview created, assigned and email sent"
    
    )
  )
})

export const getMyInterview = asyncHandler(async (req,res)=>{

  const userId = req.user._id;

  const assignments =  await Assignment.findOne(
    { candidateId: userId })
    .populate("interviewId")
    
  
  
  return res.status(200).json(
    new ApiResponse(
      200,
      {assignments},

      "interview assigned"

    )
  )
}
)