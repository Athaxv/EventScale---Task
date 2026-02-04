import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIEventRecommendations = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an event concierge. The user asks: "${query}". 
      Recommend 3 fictional but realistic upcoming events based on this query. 
      Return them as a concise markdown list with Title, Date, and Location.`,
    });

    return response.text || "No recommendations found.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't fetch recommendations right now.";
  }
};