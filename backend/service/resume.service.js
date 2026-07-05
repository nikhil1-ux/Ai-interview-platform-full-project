
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
 
/**
 * Extracts raw text from an uploaded resume file (PDF or DOCX).
 *
 * @param {Buffer} filebuffer - The buffer containing the file data.
 * @param {string} mimetype - The file's mimetype (from multer).
 * @returns {Promise<string>} The extracted, cleaned resume text.
 */
export const extractResumeText = async (filebuffer, mimetype) => {
  try {
    let rawText = "";
 
    if (mimetype === "application/pdf") {
      const data = await pdfParse(filebuffer);
      rawText = data.text;
    } else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: 
        filebuffer
      });
      rawText = result.value;
    } else {
      throw new Error("Unsupported file type for resume parsing");
    }
 
    // Collapse excess whitespace/blank lines so the text is prompt-friendly
    const cleanedText = rawText
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
 
    if (!cleanedText) {
      throw new Error("Could not extract any text from the resume");
    }
 
    return cleanedText;
  } catch (error) {
    console.error("Resume extraction error:", error.message);
    throw new Error("Failed to extract text from resume");
  }
};
