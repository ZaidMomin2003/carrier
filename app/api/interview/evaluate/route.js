import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

export async function POST(req) {
  try {
    const { question, answer, topic } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As an expert technical interviewer, evaluate this answer for a ${topic} interview question.
    
    Question: ${question}
    Answer: ${answer}
    
    Provide a concise evaluation that includes:
    1. What was good about the answer
    2. What could be improved
    3. Any missing key points
    
    Format the response in a clear, constructive manner.`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text;

    return Response.json({ feedback });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return Response.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
} 