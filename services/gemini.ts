import { GoogleGenAI, DynamicRetrievalConfig } from "@google/genai";
import { FactCheckResult, GroundingSource } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const factCheckContent = async (textToVerify: string): Promise<FactCheckResult> => {
  const ai = getClient();

  // Using gemini-2.5-flash for speed and efficiency with search tool
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are a rigorous, professional fact-checking agent called "Veritas". 
    Your goal is to verify the following text using Google Search.
    
    Text to verify:
    "${textToVerify}"

    Instructions:
    1. Use the googleSearch tool to find recent and credible sources confirming or debunking the claims.
    2. If the text contains multiple claims, address the most significant ones.
    3. Start your response with a clear "Verdict:" line (e.g., "Verdict: Likely True", "Verdict: False", "Verdict: Misleading", "Verdict: Needs Context").
    4. Provide a detailed analysis explaining your reasoning and the evidence found.
    5. Maintain an objective, journalistic tone.
    6. Do NOT output JSON. Output formatted Markdown. Use bolding for key terms.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        // Enable Google Search Grounding
        tools: [{ googleSearch: {} }],
        // We can optionally adjust retrieval config if needed, but default is usually fine for general queries.
        toolConfig: {
            googleSearch: {} 
        }
      },
    });

    const generatedText = response.text || "No analysis could be generated.";
    
    // Extract grounding chunks (sources)
    const candidates = response.candidates;
    const groundingChunks = candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri || "#"
        });
      }
    });

    // Simple heuristic to guess the verdict for UI styling purposes based on the text
    let verdict: FactCheckResult['verdict'] = 'Unverifiable';
    const lowerText = generatedText.toLowerCase();
    
    if (lowerText.includes("verdict: true") || lowerText.includes("verdict: likely true") || lowerText.includes("verdict: accurate")) {
      verdict = 'Verified';
    } else if (lowerText.includes("verdict: false") || lowerText.includes("verdict: incorrect") || lowerText.includes("verdict: debunked")) {
      verdict = 'False';
    } else if (lowerText.includes("verdict: misleading")) {
      verdict = 'Misleading';
    } else if (lowerText.includes("verdict: mixed") || lowerText.includes("verdict: complicated")) {
      verdict = 'Mixed';
    }

    return {
      markdownText: generatedText,
      sources: sources,
      verdict
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
