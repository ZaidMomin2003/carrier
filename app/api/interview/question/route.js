import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

export async function POST(req) {
  try {
    const { topic } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert technical interviewer. Generate a challenging but fair interview question about ${topic}. 
    The question should be specific and test both theoretical knowledge and practical understanding.
    Return only the question text without any additional context or explanation.`;

    const result = await model.generateContent(prompt);
    const question = result.response.text();

    return Response.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    return Response.json({ error: "Failed to generate question" }, { status: 500 });
  }
} 