import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractJobRoleAndLocation(text: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
        You are an AI model that extracts job roles and locations from resumes. Your task is to:
        1. Determine the most suitable job role based on the resume content (e.g., Full Stack, Data Science, Backend, Sales).
        2. Extract the location of the candidate if it is clearly mentioned (city, state, or country). If unclear, return only the job role.

        Resume Content:
        "${text}"

        When you have determined the job role, please return the data in the following JSON object:

        {
        "role": "Job role (e.g., Full Stack, Data Science)",
        "location": "City, State, Country (if available, else return null)"
        }

        start the response with { and end it with }
        
    `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text(); // Get the raw text response

    // Remove ```json and ``` using regex
    responseText = responseText.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(responseText); // Ensure correct JSON parsing

    return parsedResult;
  } catch (error) {
    console.error("Error extracting job role and location:", error);
    return { role: null, location: null };
  }
}
