import { Assignment } from "../models/assignInterview.model.js";
import { InterviewSession } from "../models/interviewSession.model.js";
import { Interview } from "../models/interview.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ---------------------------------------------------------------------------
// CANDIDATE: performance / results
// ---------------------------------------------------------------------------
export const getMyResults = asyncHandler(async (req, res) => {
  const candidateId = req.user._id;

  const sessions = await InterviewSession.find({ candidateId })
    .populate("interviewId", "title company jobRole")
    .sort({ createdAt: -1 });

  const results = sessions.map((s) => ({
    sessionId: s._id,
    interviewTitle: s.interviewId?.title || "Untitled Interview",
    company: s.interviewId?.company || "",
    jobRole: s.interviewId?.jobRole || "",
    status: s.status,
    questionsAnswered: s.questionsAnswered,
    totalQuestions: s.totalQuestions,
    finalReport: s.finalReport || null,
    completedAt: s.endedAt,
  }));

  const completed = results.filter(
    (r) => r.status === "completed" && r.finalReport
  );

  const avg = (key) =>
    completed.length
      ? Math.round(
          completed.reduce((sum, r) => sum + (r.finalReport[key] || 0), 0) /
            completed.length
        )
      : 0;

  const summary = {
    totalInterviews: results.length,
    completedInterviews: completed.length,
    overallScore: avg("overallScore"),
    technicalScore: avg("technicalScore"),
    communicationScore: avg("communicationScore"),
    confidenceScore: avg("confidenceScore"),
    problemSolvingScore: avg("problemSolvingScore"),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { summary, results }, "Results fetched"));
});

// ---------------------------------------------------------------------------
// CANDIDATE: ranking / leaderboard
// ---------------------------------------------------------------------------
export const getRanking = asyncHandler(async (req, res) => {
  const candidateId = String(req.user._id);

  const leaderboard = await InterviewSession.aggregate([
    { $match: { status: "completed", "finalReport.overallScore": { $gt: 0 } } },
    {
      $group: {
        _id: "$candidateId",
        avgScore: { $avg: "$finalReport.overallScore" },
        interviews: { $sum: 1 },
      },
    },
    { $sort: { avgScore: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "candidate",
      },
    },
    { $unwind: "$candidate" },
    {
      $project: {
        candidateId: "$_id",
        name: "$candidate.name",
        avgScore: { $round: ["$avgScore", 0] },
        interviews: 1,
      },
    },
  ]);

  const ranked = leaderboard.map((entry, index) => ({
    rank: index + 1,
    ...entry,
    isYou: String(entry.candidateId) === candidateId,
  }));

  const myEntry = ranked.find((r) => r.isYou) || null;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { leaderboard: ranked, myEntry }, "Ranking fetched")
    );
});

// ---------------------------------------------------------------------------
// RECRUITER: manage interviews (per-interview breakdown)
// ---------------------------------------------------------------------------
export const getRecruiterInterviews = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const interviews = await Interview.find({ createdBy: recruiterId }).sort({
    createdAt: -1,
  });

  const interviewIds = interviews.map((i) => i._id);

  const assignments = await Assignment.find({
    interviewId: { $in: interviewIds },
  }).populate("candidateId", "name email");

  const byInterview = {};
  assignments.forEach((a) => {
    const key = String(a.interviewId);
    if (!byInterview[key]) {
      byInterview[key] = {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        candidates: [],
      };
    }
    byInterview[key].total += 1;
    if (a.status === "completed") byInterview[key].completed += 1;
    else if (a.status === "in-progress") byInterview[key].inProgress += 1;
    else byInterview[key].pending += 1;

    byInterview[key].candidates.push({
      name: a.candidateId?.name || "Unknown",
      email: a.candidateId?.email || "",
      status: a.status,
    });
  });

  const data = interviews.map((i) => {
    const bucket = byInterview[String(i._id)] || {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      candidates: [],
    };

    return {
      interviewId: i._id,
      title: i.title,
      company: i.company,
      jobRole: i.jobRole,
      skills: i.skills,
      duration: i.duration,
      questions: i.questions,
      createdAt: i.createdAt,
      ...bucket,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { interviews: data }, "Interviews fetched"));
});

// ---------------------------------------------------------------------------
// RECRUITER: results (completed interview reports)
// ---------------------------------------------------------------------------
export const getRecruiterResults = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const interviews = await Interview.find({ createdBy: recruiterId });
  const interviewIds = interviews.map((i) => i._id);

  const sessions = await InterviewSession.find({
    interviewId: { $in: interviewIds },
    status: "completed",
  })
    .populate("interviewId", "title company jobRole")
    .populate("candidateId", "name email")
    .sort({ endedAt: -1 });

  const results = sessions
    .filter((s) => s.finalReport)
    .map((s) => ({
      sessionId: s._id,
      candidateName: s.candidateId?.name || "Unknown",
      candidateEmail: s.candidateId?.email || "",
      interviewTitle: s.interviewId?.title || "Untitled",
      company: s.interviewId?.company || "",
      jobRole: s.interviewId?.jobRole || "",
      completedAt: s.endedAt,
      finalReport: s.finalReport,
    }));

  return res
    .status(200)
    .json(new ApiResponse(200, { results }, "Recruiter results fetched"));
});

// ---------------------------------------------------------------------------
// RECRUITER: dashboard stats
// ---------------------------------------------------------------------------
export const getRecruiterStats = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const interviews = await Interview.find({ createdBy: recruiterId });
  const interviewIds = interviews.map((i) => i._id);

  const assignments = await Assignment.find({
    interviewId: { $in: interviewIds },
  })
    .populate("interviewId", "title company jobRole")
    .populate("candidateId", "name email")
    .sort({ createdAt: -1 });

  const counts = {
    total: assignments.length,
    assigned: 0,
    accepted: 0,
    rejected: 0,
    inProgress: 0,
    completed: 0,
  };

  assignments.forEach((a) => {
    if (a.status === "assigned") counts.assigned += 1;
    else if (a.status === "accepted") counts.accepted += 1;
    else if (a.status === "rejected") counts.rejected += 1;
    else if (a.status === "in-progress") counts.inProgress += 1;
    else if (a.status === "completed") counts.completed += 1;
  });

  const candidates = assignments.map((a) => ({
    assignmentId: a._id,
    candidateName: a.candidateId?.name || "Unknown",
    candidateEmail: a.candidateId?.email || "",
    interviewTitle: a.interviewId?.title || "Untitled",
    company: a.interviewId?.company || "",
    status: a.status,
    assignedAt: a.assignedAt,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalInterviews: interviews.length,
        pendingInterviews: counts.assigned + counts.accepted + counts.inProgress,
        completedInterviews: counts.completed,
        counts,
        candidates,
      },
      "Recruiter stats fetched"
    )
  );
});