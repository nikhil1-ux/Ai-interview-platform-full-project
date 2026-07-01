import ai from "../config/gemini.js";

export const generateQuestion = async (
  jobDescription,
  resumeText,
  previousQuestions = [],
  previousAnswer = ""
) => {
  try {
    const prompt = `
You are an experienced technical interviewer.

JOB DESCRIPTION
----------------
${jobDescription}

CANDIDATE RESUME
----------------
${resumeText}

PREVIOUS QUESTIONS
----------------
${previousQuestions.join("\n")}

LAST ANSWER
----------------
${previousAnswer}

Instructions:

1. Read the Job Description carefully.
2. Read the candidate's resume carefully.
3. Ask ONE interview question that evaluates whether the candidate is suitable for this role.
4. Prefer questions based on the technologies, projects, and responsibilities mentioned in both the resume and job description.
5. If the last answer is weak or incomplete, ask a relevant follow-up question.
6. Never repeat previous questions.
7. Keep the question under 40 words.
8. Return ONLY the interview question.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate interview question.");
  }
};

export const evaluateAnswer = async (
  question,
  answer
) => {
  try {
    const prompt = `
You are a senior interviewer.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

Return JSON only.

{
 "score":8,
 "feedback":"Good explanation with minor improvements."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(error);
    throw new Error("Evaluation failed");
  }
};

export const generateFinalReport = async (
  responses
) => {
  try {
    const prompt = `
You are a senior HR interviewer.

Interview Responses:

${JSON.stringify(responses)}

Generate JSON only.

{
 "overallScore":85,
 "strengths":"...",
 "weaknesses":"...",
 "recommendation":"Selected"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(error);
    throw new Error("Report generation failed");
  }
};