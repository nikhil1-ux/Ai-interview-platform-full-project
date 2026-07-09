import groq from "../config/groq.js";

// Llama 3.3 70B — strong general-purpose quality, fast, and on Groq's free tier.
// Swap this string if you want to try a different Groq model (e.g. "openai/gpt-oss-120b").
const MODEL = "llama-3.3-70b-versatile";

/**
 * Removes markdown code fences some models still wrap JSON in, even when
 * asked for raw JSON.
 */
const stripJson = (text) => {
  return text.replace(/```json|```/g, "").trim();
};

/**
 * Sends a single-turn prompt to Groq and returns the parsed JSON response.
 * Centralizes the request/parse boilerplate shared by all three AI calls
 * below.
 */
const askForJson = async ({ systemPrompt, userPrompt }) => {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    // Groq's OpenAI-compatible endpoint supports forcing valid JSON output.
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const text = response.choices?.[0]?.message?.content || "";
  return JSON.parse(stripJson(text));
};

/**
 * Generate Interview Question
 */
export const generateQuestion = async ({
  jobRole,
  jobDescription,
  skills,
  resume,
  previousQuestions = [],
  previousAnswer = "",
}) => {
  try {
    const userPrompt = `
JOB ROLE
--------
${jobRole}

JOB DESCRIPTION
---------------
${jobDescription}

REQUIRED SKILLS
---------------
${skills.join(", ")}

CANDIDATE RESUME
----------------
${resume}

PREVIOUS QUESTIONS
------------------
${previousQuestions.join("\n")}

LAST ANSWER
-----------
${previousAnswer}

Instructions:

1. Ask only ONE interview question.
2. Question should be based on resume.
3. Match the job description.
4. Do not repeat previous questions.
5. Increase difficulty gradually.
6. Ask practical interview questions.

Return ONLY valid JSON in this exact shape:

{
  "question": "Your question here"
}
`;

    return await askForJson({
      systemPrompt: "You are an experienced technical interviewer.",
      userPrompt,
    });
  } catch (error) {
    console.error("Generate Question Error:", error);

    throw new Error("Failed to generate interview question.");
  }
};

/**
 * Evaluate Candidate Answer
 */
export const evaluateAnswer = async ({ question, answer }) => {
  try {
    const userPrompt = `
QUESTION

${question}

CANDIDATE ANSWER

${answer}

Evaluate the answer on:

- Technical Accuracy
- Communication
- Completeness
- Problem Solving

Return ONLY valid JSON in this exact shape:

{
    "score": 85,
    "strengths": [
        "Point 1",
        "Point 2"
    ],
    "weaknesses": [
        "Point 1"
    ],
    "feedback": "Detailed feedback"
}
`;

    return await askForJson({
      systemPrompt: "You are a Senior Technical Interviewer.",
      userPrompt,
    });
  } catch (error) {
    console.error("Evaluate Answer Error:", error);

    throw new Error("Failed to evaluate candidate answer.");
  }
};

/**
 * Generate Final Interview Report
 */
export const generateFinalReport = async (interviewData) => {
  try {
    const userPrompt = `
Below is complete interview data.

${JSON.stringify(interviewData)}

Generate

1. Overall Score
2. Technical Score
3. Communication Score
4. Confidence Score
5. Problem Solving Score
6. Hiring Recommendation
7. Strengths
8. Weaknesses
9. Areas of Improvement

Return ONLY valid JSON in this exact shape:

{
    "overallScore": 90,
    "technical": 88,
    "communication": 85,
    "confidence": 91,
    "problemSolving": 87,
    "recommendation": "Hire",
    "strengths": [
        "Point 1",
        "Point 2"
    ],
    "weaknesses": [
        "Point 1"
    ],
    "improvement": [
        "Point 1",
        "Point 2"
    ]
}
`;

    return await askForJson({
      systemPrompt: "You are an experienced HR recruiter.",
      userPrompt,
    });
  } catch (error) {
    console.error("Final Report Error:", error);

    throw new Error("Failed to generate final interview report.");
  }
};