import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const prompt = `
      You are a specialized typing test generator. 
      Topic: ${topic && topic.trim() !== "" ? topic : "General Knowledge"}.

      DECISION LOGIC:
      1. IF Music/Lyrics: Real lyrics. Source: "Artist - Song".
      2. IF Poetry: Real verses. Source: "Author - Poem".
      3. IF Culture/History: Vivid snippet. Source: Specific event/book.
      4. IF Language/Other: Informative paragraph. Source: Specific subject.

      CONSTRAINTS:
      - LANGUAGE: Native script only.
      - SYMBOL SAFETY: Standard keyboard characters only. No curly quotes.
      - LENGTH: 25 words max.
      
      OUTPUT FORMAT:
      [Challenge Text]
      ###
      [Specific Source]
    `;

    // ADDED: Retry and Fallback Logic
    const callAi = async (modelName: string) => {
      return await generateText({
        model: google(modelName),
        prompt: prompt,
        // Optional: maxRetries: 2 (The SDK can handle some retries automatically)
      });
    };

    let result;
    try {
      // Primary attempt with your preferred model
      result = await callAi("models/gemini-2.5-flash");
    } catch (e: any) {
      console.warn("Primary model busy, trying fallback...");
      // Fallback attempt with the highly stable 1.5-flash
      result = await callAi("models/gemini-1.5-flash");
    }

    const parts = result.text.split("###");
    const challengeText = parts[0]?.trim() || "Error generating text.";
    const sourceText = parts[1]?.trim() || "TyperAI Archive";

    return Response.json({ text: challengeText, source: sourceText });
  } catch (error: any) {
    console.error("Final Backend Error:", error);
    // If both fail, send a friendly error to the frontend
    return new Response(
      JSON.stringify({
        error:
          "AI is currently overwhelmed. Please try again in a few seconds.",
        details: error.message,
      }),
      { status: 503 },
    );
  }
}
