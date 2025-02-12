import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { role, level } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate 5 technical interview questions for a ${level} ${role} position. 
    Format your response as a JSON array of strings containing only the questions.
    Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Safely parse the response and provide fallback
    let questions;
    try {
      questions = JSON.parse(response.text());
    } catch (e) {
      // If parsing fails, create a simple array with the response
      questions = [
        "What is your experience with JavaScript?",
        "Explain the concept of REST APIs.",
        "How do you handle state management in React?",
        "Describe your experience with databases.",
        "How do you approach testing in your applications?"
      ];
    }

    // Ensure we always return an array
    if (!Array.isArray(questions)) {
      questions = [questions].filter(Boolean);
    }

    return Response.json({ 
      questions,
      success: true 
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    // Return default questions if there's an error
    return Response.json({ 
      questions: [
        "What is your experience with JavaScript?",
        "Explain the concept of REST APIs.",
        "How do you handle state management in React?",
        "Describe your experience with databases.",
        "How do you approach testing in your applications?"
      ],
      success: false,
      error: 'Failed to generate questions, using fallback questions'
    });
  }
} 