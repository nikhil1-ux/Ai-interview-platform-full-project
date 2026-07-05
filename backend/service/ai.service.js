import ai from "../config/gemini.js";

const MODEL = "gemini-2.5-flash";

/**
 * Removes markdown code blocks from Gemini responses.
 */
const stripJson = (text) => {
  return text.replace(/```json|```/g, "").trim();
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
    const prompt = `
You are an experienced technical interviewer.

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

Return ONLY valid JSON.

{
  "question":"Your question here"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = stripJson(response.text);

    return JSON.parse(text);
  } catch (error) {
    console.error("Generate Question Error:", error);

    throw new Error("Failed to generate interview question.");
  }
};

/**
 * Evaluate Candidate Answer
 */
export const evaluateAnswer = async ({
  question,
  answer,
}) => {
  try {
    const prompt = `
You are a Senior Technical Interviewer.

QUESTION

${question}

CANDIDATE ANSWER

${answer}

Evaluate the answer on:

- Technical Accuracy
- Communication
- Completeness
- Problem Solving

Return ONLY JSON.

{
    "score":85,
    "strengths":[
        "Point 1",
        "Point 2"
    ],
    "weaknesses":[
        "Point 1"
    ],
    "feedback":"Detailed feedback"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = stripJson(response.text);

    return JSON.parse(text);
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
    const prompt = `
You are an experienced HR recruiter.

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
9 . Areas of Improvement

Return ONLY JSON.

{
    "overallScore":90,
    "technical":88,
    "communication":85,
    "confidence":91,
     "problemSolving":87,
    "recommendation":"Hire",
    "strengths":[
        "Point 1",
        "Point 2"
    ],
    "weaknesses":[
        "Point 1"
    ],
    "improvement":[
        "Point 1",
        "Point 2"
    ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = stripJson(response.text);

    return JSON.parse(text);
  } catch (error) {
    console.error("Final Report Error:", error);

    throw new Error("Failed to generate final interview report.");
  }
};