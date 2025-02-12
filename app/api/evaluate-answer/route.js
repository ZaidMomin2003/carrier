import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { question, answer } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As an expert technical interviewer, evaluate the following interview response:

Question: "${question}"
Answer: "${answer}"

Provide a detailed evaluation in the following JSON format:
{
  "overallScore": <number between 0-100>,
  "technicalAccuracy": {
    "score": <number between 0-100>,
    "feedback": "<specific feedback on technical accuracy>"
  },
  "communicationClarity": {
    "score": <number between 0-100>,
    "feedback": "<feedback on communication style and clarity>"
  },
  "completeness": {
    "score": <number between 0-100>,
    "feedback": "<feedback on answer completeness and depth>"
  },
  "strengths": ["<point 1>", "<point 2>", ...],
  "areasForImprovement": ["<point 1>", "<point 2>", ...],
  "suggestedFollowUp": "<a follow-up question to deepen the discussion>",
  "summary": "<brief overall assessment>"
}

Base the evaluation on:
1. Technical accuracy and depth of knowledge
2. Communication clarity and professionalism
3. Completeness of the answer
4. Real-world application understanding
5. Problem-solving approach`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const evaluation = JSON.parse(response.text());
      
      // Calculate weighted average for overall score if not provided
      if (!evaluation.overallScore) {
        evaluation.overallScore = Math.round(
          (evaluation.technicalAccuracy.score * 0.4) +
          (evaluation.communicationClarity.score * 0.3) +
          (evaluation.completeness.score * 0.3)
        );
      }

      return Response.json({
        success: true,
        evaluation: evaluation,
        feedback: formatFeedback(evaluation)
      });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return Response.json({
        success: false,
        error: 'Failed to parse evaluation',
        rawFeedback: response.text()
      });
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to evaluate answer'
    }, { status: 500 });
  }
}

function formatFeedback(evaluation) {
  return `
Overall Score: ${evaluation.overallScore}%

Technical Accuracy (${evaluation.technicalAccuracy.score}%):
${evaluation.technicalAccuracy.feedback}

Communication Clarity (${evaluation.communicationClarity.score}%):
${evaluation.communicationClarity.feedback}

Completeness (${evaluation.completeness.score}%):
${evaluation.completeness.feedback}

Key Strengths:
${evaluation.strengths.map(s => `• ${s}`).join('\n')}

Areas for Improvement:
${evaluation.areasForImprovement.map(a => `• ${a}`).join('\n')}

Follow-up Question:
${evaluation.suggestedFollowUp}

Summary:
${evaluation.summary}
`;
} 