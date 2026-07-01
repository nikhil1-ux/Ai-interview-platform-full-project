import { Interview } from "../models/interview.model.js";              // Interview Session
import { Assignment } from "../models/assignment.model.js";
import { InterviewTemplate } from "../models/interviewTemplate.model.js";
import { User } from "../models/user.model.js";

import {
  generateQuestion,
  evaluateAnswer,
  generateFinalReport,
} from "../services/ai.service.js";


async function finishInterview(io, socket, interviewSession, template) {

    try{

        const report = await generateFinalReport({
            jobRole: template.jobRole,
            jobDescription: template.description,
            skills: template.skills,
            responses: interviewSession.responses,
        });

        interviewSession.status="completed";
        interviewSession.endedAt=new Date();

        interviewSession.overallScore=report.overallScore;
        interviewSession.strengths=report.strengths;
        interviewSession.weaknesses=report.weaknesses;
        interviewSession.recommendation=report.recommendation;

        await interviewSession.save();

        io.to(interviewSession._id.toString()).emit(
            "interviewCompleted",
            {
                success:true,
                report
            }
        );

    }
    catch(error){

        console.log(error);

        socket.emit("error",{
            message:"Unable to generate report"
        });

    }

}


export default function interviewSocket(io) {

  io.on("connection", (socket) => {

    console.log(`✅ Candidate Connected : ${socket.id}`);

    /**
     * Candidate joins interview
     */
    socket.on("joinInterview", async ({ interviewId }) => {

      try {

        // 1. Join personal room
        socket.join(interviewId);

        console.log(`Socket joined room ${interviewId}`);

        // 2. Load Interview Session
        const interviewSession = await Interview.findById(interviewId);

        if (!interviewSession) {
          return socket.emit("error", {
            message: "Interview session not found",
          });
        }

        // 3. Load Assignment
        const assignment = await Assignment.findById(
          interviewSession.assignmentId
        );

        if (!assignment) {
          return socket.emit("error", {
            message: "Assignment not found",
          });
        }

        /**
         * IMPORTANT
         *
         * assignment.interviewId
         * should point to InterviewTemplate
         */

        // 4. Load Interview Template
        const template = await InterviewTemplate.findById(
          assignment.interviewId
        );

        if (!template) {
          return socket.emit("error", {
            message: "Interview template not found",
          });
        }

        // 5. Load Candidate
        const candidate = await User.findById(
          interviewSession.candidateId
        );

        if (!candidate) {
          return socket.emit("error", {
            message: "Candidate not found",
          });
        }

        // 6. Previous Questions
        const previousQuestions =
          interviewSession.responses.map(
            (item) => item.question
          );

        // 7. Generate first question
        const question = await generateQuestion({
          resume: candidate.resumeText,
          jobRole: template.jobRole,
          jobDescription: template.description,
          skills: template.skills,
          previousQuestions,
        });

        // 8. Save question
        interviewSession.responses.push({
          question,
        });

        interviewSession.currentQuestion = 1;

        await interviewSession.save();

        // 9. Send first question
        socket.emit("question", {
          currentQuestion: 1,
          totalQuestions: template.questions,
          question,
        });

      } catch (error) {

        console.log(error);

        socket.emit("error", {
          message: "Unable to start interview",
        });

      }

    });
     socket.on("submitAnswer", async ({ interviewId, answer, duration }) => {
  try {
    // 1. Find interview session
    const interviewSession = await Interview.findById(interviewId);

    if (!interviewSession) {
      return socket.emit("error", {
        message: "Interview session not found",
      });
    }

    // 2. Find assignment
    const assignment = await Assignment.findById(
      interviewSession.assignmentId
    );

    if (!assignment) {
      return socket.emit("error", {
        message: "Assignment not found",
      });
    }

    // 3. Find interview template
    const template = await InterviewTemplate.findById(
      assignment.interviewId
    );

    if (!template) {
      return socket.emit("error", {
        message: "Interview template not found",
      });
    }

    // 4. Find candidate
    const candidate = await User.findById(
      interviewSession.candidateId
    );

    if (!candidate) {
      return socket.emit("error", {
        message: "Candidate not found",
      });
    }

    // 5. Get current response
    const currentResponse =
      interviewSession.responses[
        interviewSession.responses.length - 1
      ];

    currentResponse.answer = answer;
    currentResponse.duration = duration;

    // 6. Evaluate answer using Gemini
    const evaluation = await evaluateAnswer({
      resume: candidate.resumeText,
      jobRole: template.jobRole,
      jobDescription: template.description,
      skills: template.skills,
      question: currentResponse.question,
      answer,
    });

    currentResponse.score = evaluation.score;
    currentResponse.feedback = evaluation.feedback;

    await interviewSession.save();

    // 7. Check if interview completed
    if (
      interviewSession.responses.length >= template.questions
    ) {
      socket.emit("interviewCompleted");

      return;
    }

    // 8. Generate next question
    const previousQuestions =
      interviewSession.responses.map((r) => r.question);

    const nextQuestion = await generateQuestion({
      resume: candidate.resumeText,
      jobRole: template.jobRole,
      jobDescription: template.description,
      skills: template.skills,
      previousQuestions,
    });

    // 9. Save next question
    interviewSession.responses.push({
      question: nextQuestion,
    });

    interviewSession.currentQuestion += 1;

    await interviewSession.save();

    // 10. Send next question
    socket.emit("question", {
      currentQuestion: interviewSession.currentQuestion,
      totalQuestions: template.questions,
      question: nextQuestion,
    });

  } catch (error) {
    console.error(error);

    socket.emit("error", {
      message: "Unable to submit answer",
    });
  }
});
  });

}







