import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { connectSocket, getSocket, disconnectSocket } from "../socket/socket";
import "../candidCompStyle/InterviewRoom.css";


const formatTime = (totalSeconds) => {
  const s = Math.max(0, totalSeconds);
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const interviewTitle = location.state?.interviewTitle;

  // "connecting" | "in-progress" | "completed" | "error"
  const [status, setStatus] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  // shape: { questionId, question, questionIndex, totalQuestions, timeLimit }

  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const [timeLimit, setTimeLimit] = useState(null); // seconds, for the progress bar
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  const questionStartedAtRef = useRef(null);
  const answerTextRef = useRef("");
  const submittingRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  // keep refs in sync so the interval callback always sees fresh values
  useEffect(() => {
    answerTextRef.current = answerText;
  }, [answerText]);

  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

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
      clearTimeout(submitTimeoutRef.current);
      setCurrentQuestion(data);
      setAnswerText("");
      setLastFeedback(null);
      setStatus("in-progress");
      questionStartedAtRef.current = Date.now();
      setSubmitting(false);
      submittingRef.current = false;
      setAutoSubmitted(false);

      const limit = data.timeLimit ?? null;
      const remaining = data.timeRemaining ?? data.timeLimit ?? null;
      setTimeLimit(limit);
      setSecondsLeft(remaining);
    };

    const handleAnswerEvaluated = (data) => {
      clearTimeout(submitTimeoutRef.current);
      setLastFeedback(data);
      // Stay locked — submitting only clears once the next question (or
      // interview-completed) actually arrives. Clearing it here left a gap
      // where the button re-enabled for the same, already-answered
      // question while the next one was still being generated.

      // Restart the safety net for this second stage of the wait (waiting
      // on the next question / final report), so a hang here doesn't leave
      // the candidate stuck with no way to recover either.
      submitTimeoutRef.current = setTimeout(() => {
        if (submittingRef.current) {
          submittingRef.current = false;
          setSubmitting(false);
          setErrorMessage(
            "The server took too long to load the next question. Please refresh and continue."
          );
        }
      }, 20000);
    };

    const handleInterviewCompleted = (data) => {
      clearTimeout(submitTimeoutRef.current);
      setFinalReport(data.finalReport);
      setCurrentQuestion(null);
      setStatus("completed");
      setSubmitting(false);
      submittingRef.current = false;
      setSecondsLeft(null);
      setTimeLimit(null);
    };

    const handleInterviewError = (data) => {
      clearTimeout(submitTimeoutRef.current);
      setErrorMessage(data.message || "Something went wrong");
      setSubmitting(false);
      submittingRef.current = false;
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
      clearTimeout(submitTimeoutRef.current);
      disconnectSocket();
    };
  }, [sessionId]);

  const handleSubmitAnswer = (auto = false) => {
    if (!currentQuestion || submittingRef.current) return;

    const trimmed = answerTextRef.current.trim();
    if (!auto && !trimmed) return; // manual submit still requires text

    const timeTaken = questionStartedAtRef.current
      ? Math.round((Date.now() - questionStartedAtRef.current) / 1000)
      : 0;

    // Lock synchronously first — setSubmitting(true) alone isn't enough
    // because submittingRef only catches up after the next render, which
    // leaves a window for a fast double-click/double-Enter to slip through
    // and trigger two "submit-answer" emits (and two evaluations) for the
    // same question.
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage(null);
    if (auto) setAutoSubmitted(true);

    getSocket().emit("submit-answer", {
      sessionId,
      questionId: currentQuestion.questionId,
      answer: trimmed || "(No answer submitted — time ran out)",
      timeTaken,
    });

    // Safety net: if the server never responds (dropped connection, backend
    // hang, slow AI scoring, etc.), don't leave the candidate permanently
    // stuck with a disabled button and no way to retry.
    clearTimeout(submitTimeoutRef.current);
    submitTimeoutRef.current = setTimeout(() => {
      if (submittingRef.current) {
        submittingRef.current = false;
        setSubmitting(false);
        setErrorMessage(
          "The server took too long to respond. Please try submitting again."
        );
      }
    }, 20000);
  };

  // Countdown timer: ticks every second while a question is active and
  // nothing has been submitted yet; auto-submits whatever's typed (or a
  // placeholder) the moment it hits zero.
  useEffect(() => {
    if (secondsLeft === null || status !== "in-progress" || submitting) {
      return;
    }

    if (secondsLeft <= 0) {
      handleSubmitAnswer(true);
      return;
    }

    timerIntervalRef.current = setTimeout(() => {
      setSecondsLeft((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearTimeout(timerIntervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, status, submitting]);

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

        <button
          className="dashboard-return-btn"
          onClick={() => navigate("/candidate-dashboard")}
        >
          🏠 Go to Dashboard
        </button>
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
            <div className="question-top-row">
              <p className="question-meta">
                Question {currentQuestion.questionIndex} of{" "}
                {currentQuestion.totalQuestions}
              </p>

              {secondsLeft !== null && (
                <div
                  className={`question-timer ${
                    secondsLeft <= 10 ? "question-timer-critical" : ""
                  }`}
                  aria-live="polite"
                >
                  ⏱ {formatTime(secondsLeft)}
                </div>
              )}
            </div>

            {timeLimit && secondsLeft !== null && (
              <div className="timer-bar-track">
                <div
                  className={`timer-bar-fill ${
                    secondsLeft <= 10 ? "timer-bar-critical" : ""
                  }`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, (secondsLeft / timeLimit) * 100)
                    )}%`,
                  }}
                />
              </div>
            )}

            <p className="question-text">💬 {currentQuestion.question}</p>

            {lastFeedback && (
              <div className="feedback-box">
                <p><b>Previous score:</b> {lastFeedback.score}/100</p>
                <p>{lastFeedback.feedback}</p>
              </div>
            )}

            {errorMessage && (
              <p className="submit-error-note">⚠️ {errorMessage}</p>
            )}

            {autoSubmitted && submitting && (
              <p className="auto-submit-note">
                ⏱ Time's up — your answer was submitted automatically.
              </p>
            )}

            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              disabled={submitting}
            />

            <button
              onClick={() => handleSubmitAnswer(false)}
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