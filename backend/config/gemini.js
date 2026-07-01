import {GoogleGenAi} from "@google/genai" ;

const ai = new GoogleGenAi({
  apiKey: process.env.GEMINI_API_KEY,
});

export default ai;