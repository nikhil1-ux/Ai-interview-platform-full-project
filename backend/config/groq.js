import OpenAI from "openai";

// Groq exposes an OpenAI-compatible endpoint, so the official OpenAI SDK
// works unmodified — just point it at Groq's base URL with a Groq API key.
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default groq;