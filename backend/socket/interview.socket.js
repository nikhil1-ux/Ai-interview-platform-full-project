import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Interview } from "../models/interview.model.js";
import { Assignment } from "../models/assignInterview.model.js";
import { InterviewSession } from "../models/interviewSession.model.js";
import { User } from "../models/user.model.js";

import {
  generateQuestion,
  evaluateAnswer,
  generateFinalReport,
} from "../service/ai.service.js";

/**
 * Simple per-session lock. join-interview (on reconnect/refresh) and
 * submit-answer both read-modify-save the same InterviewSession document;
 * if they overlap, one save can clobber the other's changes and leave the
 * candidate's browser holding a questionId the server no longer recognizes
 * ("Question not found for this session"). Serializing access per session
 * closes that race.
 */
const sessionLocks = new Map();

const withSessionLock = (sessionId, fn) => {
  const run = (sessionLocks.get(sessionId) || Promise.resolve())
    .catch(() => {}) // don't let a previous failure jam the queue
    .then(fn);

  sessionLocks.set(sessionId, run);
  run.finally(() => {
    if (sessionLocks.get(sessionId) === run) {
      sessionLocks.delete(sessionId);
    }
  });

  return run;
};

/**
 * Socket.IO auth middleware.
 * Expects the access token to be sent as:
 *   io(URL, { auth: { token: "<accessToken>" } })
 */
const authenticateSocket = (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Unauthorized - No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.user = decoded;

    next();
  } catch (error) {
    next(new Error("Unauthorized - Invalid or expired token"));
  }
};

/**
 * Builds the payload passed to the AI question generator.
 */
const buildQuestionPayload = (interview, session, resume) => ({
  jobRole: interview.jobRole,
  jobDescription: interview.description,
  skills: interview.skills,
  resume: resume || "",
  previousQuestions: session.responses.map((r) => r.question),
  previousAnswer:
    session.responses.length > 0
      ? session.responses[session.responses.length - 1].answer
      : "",
});

/**
 * Works out how many seconds a candidate gets per question, spreading the
 * interview's total duration (minutes) evenly across all questions.
 * Falls back to a sane default when the recruiter didn't set a duration.
 */
const getPerQuestionSeconds = (interview, totalQuestions) => {
  const DEFAULT_SECONDS = 120; // 2 minutes/question fallback
  const MIN_SECONDS = 30; // never give less than 30s, even for short interviews

  if (!interview?.duration || !totalQuestions) return DEFAULT_SECONDS;

  const perQuestion = Math.round((interview.duration * 60) / totalQuestions);
  return Math.max(MIN_SECONDS, perQuestion);
};

/**
 * Generates the next question, stores it on the session as a pending
 * response (answer/score empty until the candidate replies) and emits
 * it to the interview room.
 */
const sendNextQuestion = async (io, session, interview, resume) => {
  const { question } = await generateQuestion(
    buildQuestionPayload(interview, session, resume)
  );
  applyNextQuestion(io, session, interview, question);
  await session.save();
};

// Pure AI call — no session mutation, no save, no emit. Lets the caller
// kick this off in parallel with other work (e.g. scoring the previous
// answer) instead of waiting on it sequentially.
const generateNextQuestionText = async (interview, session, resume) => {
  const { question } = await generateQuestion(
    buildQuestionPayload(interview, session, resume)
  );
  return question;
};

// Applies an already-generated question to the session (mutates in memory
// only — caller is responsible for session.save()) and emits it.
const applyNextQuestion = (io, session, interview, question) => {
  const questionId = crypto.randomUUID();
  const askedAt = new Date();
  const timeLimit = getPerQuestionSeconds(interview, session.totalQuestions);

  session.responses.push({
    questionId,
    question,
    difficulty: "medium",
    topic: interview.jobRole,
    answer: "",
    score: null,
    feedback: "",
    timeTaken: 0,
    askedAt,
  });

  session.currentQuestionIndex += 1;
  session.status = "in-progress";

  io.to(session.sessionToken).emit("new-question", {
    questionId,
    question,
    questionIndex: session.currentQuestionIndex,
    totalQuestions: session.totalQuestions,
    timeLimit,
    timeRemaining: timeLimit,
  });
};

/**
 * Scores the interview responses and finalizes the session.
 */
const finalizeInterview = async (io, session, interview) => {
  const finalReport = await generateFinalReport({
    interviewTitle: interview.title,
    jobRole: interview.jobRole,
    responses: session.responses.map((r) => ({
      question: r.question,
      answer: r.answer,
      score: r.score,
    })),
  });

  session.status = "completed";
  session.endedAt = new Date();
  session.duration = Math.round(
    (session.endedAt.getTime() - session.startedAt.getTime()) / 60000
  );

  session.finalReport = {
    technicalScore: finalReport.technical ?? 0,
    communicationScore: finalReport.communication ?? 0,
    confidenceScore: finalReport.confidence ?? 0,
    problemSolvingScore: finalReport.problemSolving ?? 0,
    overallScore: finalReport.overallScore ?? 0,
    strengths: finalReport.strengths ?? [],
    weaknesses: finalReport.weaknesses ?? [],
    recommendation: finalReport.recommendation ?? "Consider",
    summary: finalReport.summary ?? "",
  };

  await session.save();

  await Assignment.findByIdAndUpdate(session.assignmentId, {
    status: "completed",
  });

  io.to(session.sessionToken).emit("interview-completed", {
    sessionId: session.sessionToken,
    finalReport: session.finalReport,
  });
};

/**
 * Registers all interview related Socket.IO event handlers.
 * Call once when the server boots, e.g:
 *   const io = initSocket(server);
 *   registerInterviewSocket(io);
 */
export const registerInterviewSocket = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user?._id})`);

    // Candidate joins their interview room and receives the first question
    socket.on("join-interview", async ({ sessionId }) => {
      try {
        if (!sessionId) {
          throw new Error("sessionId is required");
        }

        await withSessionLock(sessionId, async () => {
        const session = await InterviewSession.findOne({
          sessionToken: sessionId,
        }).populate("interviewId");

        if (!session) {
          throw new Error("Interview session not found");
        }

        if (!session.candidateId.equals(socket.user._id)) {
          throw new Error("You are not authorized to join this interview");
        }

        if (session.status === "completed") {
          socket.emit("interview-completed", {
            sessionId: session.sessionToken,
            finalReport: session.finalReport,
          });
          return;
        }

        socket.join(session.sessionToken);

        session.activeSocketId = socket.id;
        session.isConnected = true;
        session.lastSeen = new Date();
        await session.save();

        const candidate = await User.findById(socket.user._id);

        socket.emit("session-joined", {
          sessionId: session.sessionToken,
          status: session.status,
          currentQuestionIndex: session.currentQuestionIndex,
          totalQuestions: session.totalQuestions,
        });

        const pending = session.responses[session.responses.length - 1];

        // Resume an unanswered question, otherwise generate a fresh one
        if (pending && pending.score === null) {
          const timeLimit = getPerQuestionSeconds(
            session.interviewId,
            session.totalQuestions
          );
          const elapsedSeconds = pending.askedAt
            ? Math.floor((Date.now() - new Date(pending.askedAt).getTime()) / 1000)
            : 0;
          const timeRemaining = Math.max(0, timeLimit - elapsedSeconds);

          socket.emit("new-question", {
            questionId: pending.questionId,
            question: pending.question,
            questionIndex: session.currentQuestionIndex,
            totalQuestions: session.totalQuestions,
            timeLimit,
            timeRemaining,
          });
        } else {
          await sendNextQuestion(
            io,
            session,
            session.interviewId,
            candidate?.resumeText
          );
        }
        });
      } catch (error) {
        console.error("join-interview error:", error.message);
        socket.emit("interview-error", { message: error.message });
      }
    });

    // Candidate submits an answer for the current question
    socket.on("submit-answer", async ({ sessionId, questionId, answer, timeTaken }) => {
      try {
        if (!sessionId || !questionId) {
          throw new Error("sessionId and questionId are required");
        }

        await withSessionLock(sessionId, async () => {
        const session = await InterviewSession.findOne({
          sessionToken: sessionId,
        }).populate("interviewId");

        if (!session) {
          throw new Error("Interview session not found");
        }

        if (!session.candidateId.equals(socket.user._id)) {
          throw new Error("You are not authorized to update this interview");
        }

        let response = session.responses.find(
          (r) => r.questionId === questionId
        );

        // Defensive fallback: if the exact questionId the client sent
        // doesn't match (e.g. stale state from a reconnect that happened
        // before this session was created), but there's still exactly one
        // unanswered pending question, assume that's the one the candidate
        // meant to answer instead of hard-failing the whole interview.
        if (!response) {
          const pending = session.responses.find((r) => r.score === null);
          if (pending) {
            response = pending;
          }
        }

        if (!response) {
          throw new Error("Question not found for this session");
        }

        // Set the raw answer immediately — the next question's prompt only
        // needs this text, not the AI's score/feedback on it, so there's no
        // reason to make that call wait on evaluation finishing first.
        response.answer = answer;
        response.timeTaken = timeTaken ?? 0;
        response.answeredAt = new Date();

        const isLastQuestion =
          session.questionsAnswered + 1 >= session.totalQuestions;

        const candidate = isLastQuestion
          ? null
          : await User.findById(socket.user._id);

        // Kick off both AI calls together instead of one after another.
        const [evaluation, nextQuestionText] = await Promise.all([
          evaluateAnswer({
            question: response.question,
            answer,
          }),
          isLastQuestion
            ? Promise.resolve(null)
            : generateNextQuestionText(
                session.interviewId,
                session,
                candidate?.resumeText
              ),
        ]);

        response.score = evaluation.score ?? 0;
        response.feedback = evaluation.feedback ?? "";

        session.questionsAnswered += 1;
        session.lastSeen = new Date();

        socket.emit("answer-evaluated", {
          questionId: response.questionId,
          score: response.score,
          feedback: response.feedback,
          strengths: evaluation.strengths ?? [],
          weaknesses: evaluation.weaknesses ?? [],
        });

        if (isLastQuestion) {
          await session.save();
          await finalizeInterview(io, session, session.interviewId);
        } else {
          applyNextQuestion(io, session, session.interviewId, nextQuestionText);
          await session.save();
        }
        });
      } catch (error) {
        console.error("submit-answer error:", error.message);
        socket.emit("interview-error", { message: error.message });
      }
    });

    // Candidate explicitly pauses the interview
    socket.on("pause-interview", async ({ sessionId }) => {
      try {
        const session = await InterviewSession.findOne({
          sessionToken: sessionId,
        });

        if (!session) return;

        if (session.status !== "completed") {
          session.status = "paused";
          session.isConnected = false;
          session.lastSeen = new Date();
          await session.save();
        }
      } catch (error) {
        console.error("pause-interview error:", error.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        console.log(`Socket disconnected: ${socket.id}`);

        const session = await InterviewSession.findOne({
          activeSocketId: socket.id,
        });

        if (!session || session.status === "completed") return;

        session.isConnected = false;
        session.lastSeen = new Date();

        if (session.status === "in-progress") {
          session.status = "paused";
        }

        await session.save();
      } catch (error) {
        console.error("disconnect handler error:", error.message);
      }
    });
  });
};