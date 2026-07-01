import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { connectSocket, getSocket, disconnectSocket } from "../socket/socket";

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const interviewTitle = location.state?.interviewTitle;

  // "connecting" | "in-progress" | "completed" | "error"
  const [status, setStatus] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  // shape: { questionId, question, questionIndex, totalQuestions }

  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const questionStartedAtRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = connectSocket();

    const handleConnectError = (err) => {
      setStatus("error");
      setErrorMessage(err.message || "Could not connect to the interview server");
    };

    const handleSessionJoined = (data) => {
      if (data.status === "completed") {
        setStatus("completed");
      }
    };

    const handleNewQuestion = (data) => {
      setCurrentQuestion(data);
      setAnswerText("");
      setLastFeedback(null);
      setStatus("in-progress");
      questionStartedAtRef.current = Date.now();
      setSubmitting(false);
    };

    const handleAnswerEvaluated = (data) => {
      setLastFeedback(data);
      setSubmitting(false);
    };

    const handleInterviewCompleted = (data) => {
      setFinalReport(data.finalReport);
      setCurrentQuestion(null);
      setStatus("completed");
      setSubmitting(false);
    };

    const handleInterviewError = (data) => {
      setErrorMessage(data.message || "Something went wrong");
      setSubmitting(false);
    };

    socket.on("connect_error", handleConnectError);
    socket.on("session-joined", handleSessionJoined);
    socket.on("new-question", handleNewQuestion);
    socket.on("answer-evaluated", handleAnswerEvaluated);
    socket.on("interview-completed", handleInterviewCompleted);
    socket.on("interview-error", handleInterviewError);

    socket.emit("join-interview", { sessionId });

    // Leave the room / close the socket when the candidate navigates away
    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("session-joined", handleSessionJoined);
      socket.off("new-question", handleNewQuestion);
      socket.off("answer-evaluated", handleAnswerEvaluated);
      socket.off("interview-completed", handleInterviewCompleted);
      socket.off("interview-error", handleInterviewError);
      disconnectSocket();
    };
  }, [sessionId]);

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !answerText.trim() || submitting) return;

    const timeTaken = questionStartedAtRef.current
      ? Math.round((Date.now() - questionStartedAtRef.current) / 1000)
      : 0;

    setSubmitting(true);

    getSocket().emit("submit-answer", {
      sessionId,
      questionId: currentQuestion.questionId,
      answer: answerText.trim(),
      timeTaken,
    });
  };

  if (status === "error") {
    return (
      <div className="interview-room">
        <h1>🎤 AI Interview Session</h1>
        <p style={{ color: "red" }}>{errorMessage}</p>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="interview-room">
        <h1>🎤 Interview Complete</h1>

        {interviewTitle && <p><b>Interview:</b> {interviewTitle}</p>}

        {finalReport ? (
          <div className="report-box">
            <p><b>Overall Score:</b> {finalReport.overallScore}</p>
            <p><b>Technical:</b> {finalReport.technicalScore}</p>
            <p><b>Communication:</b> {finalReport.communicationScore}</p>
            <p><b>Recommendation:</b> {finalReport.recommendation}</p>
            <p><b>Summary:</b> {finalReport.summary}</p>

            {finalReport.strengths?.length > 0 && (
              <>
                <b>Strengths</b>
                <ul>
                  {finalReport.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </>
            )}

            {finalReport.weaknesses?.length > 0 && (
              <>
                <b>Areas to improve</b>
                <ul>
                  {finalReport.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <p>This interview has already been completed.</p>
        )}
      </div>
    );
  }

  return (
    <div className="interview-room">
      <h1>🎤 AI Interview Session</h1>

      <div className="session-box">
        {interviewTitle && <p><b>Interview:</b> {interviewTitle}</p>}
        <p><b>Session ID:</b> {sessionId}</p>
        <p><b>Status:</b> {status}</p>
      </div>

      <div className="chat-box">
        {!currentQuestion ? (
          <p>Connecting to your interviewer...</p>
        ) : (
          <>
            <p className="question-meta">
              Question {currentQuestion.questionIndex} of{" "}
              {currentQuestion.totalQuestions}
            </p>

            <p className="question-text">💬 {currentQuestion.question}</p>

            {lastFeedback && (
              <div className="feedback-box">
                <p><b>Previous score:</b> {lastFeedback.score}/100</p>
                <p>{lastFeedback.feedback}</p>
              </div>
            )}

            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              disabled={submitting}
            />

            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !answerText.trim()}
            >
              {submitting ? "Evaluating..." : "Submit Answer"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;