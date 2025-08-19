import { GoogleGenAI, Type } from "@google/genai";
import type { QuizData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    mcqs: {
      type: Type.ARRAY,
      description: "A list of multiple choice questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The question text.",
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers.",
            items: { type: Type.STRING },
          },
          answer: {
            type: Type.STRING,
            description: "The correct answer, which must be one of the provided options.",
          },
        },
        required: ["question", "options", "answer"],
      },
    },
    trueFalse: {
      type: Type.ARRAY,
      description: "A list of true or false questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The statement for the true/false question.",
          },
          answer: {
            type: Type.BOOLEAN,
            description: "The correct answer, true or false.",
          },
        },
        required: ["question", "answer"],
      },
    },
  },
  required: ["mcqs", "trueFalse"],
};

export const generateQuizFromFile = async (fileBase64: string, mimeType: string, mcqCount: number, trueFalseCount: number): Promise<QuizData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: fileBase64,
              },
            },
            {
              text: `Analyze the content of this document and generate a quiz. Create ${mcqCount} multiple-choice questions and ${trueFalseCount} true/false questions based on the key information presented. Ensure the questions cover a range of topics from the document.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: quizSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const quizData: QuizData = JSON.parse(jsonText);

    // Basic validation to ensure the structure is as expected
    if (!quizData.mcqs || !quizData.trueFalse) {
      throw new Error("AI response is missing required quiz sections.");
    }
    
    // Ensure the AI returns something, even if empty arrays, for consistency.
    if (!quizData.mcqs) quizData.mcqs = [];
    if (!quizData.trueFalse) quizData.trueFalse = [];

    return quizData;
  } catch (error) {
    console.error("Error generating quiz from Gemini API:", error);
    throw new Error("Failed to generate quiz. The AI model may have had trouble processing the document.");
  }
};
