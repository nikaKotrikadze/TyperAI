// src/app/api/generate/route.ts
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    // We build a more "instructional" prompt to handle the language logic
    const prompt = `
      You are a typing test generator.
      Topic: ${topic && topic.trim() !== "" ? topic : "a general interesting fact"}.
      
      CRITICAL RULES:
      1. If the topic specifies a language (e.g., "Georgian", "French", "Spanish"), you MUST write the paragraph ENTIRELY in that language using its native script.
      2. For "Georgian", use the Mkhedruli script (ქართული ანბანი).
      3. Length: Maximum 25 words.
      4. Content: Engaging, no introductory text, no quotes, just the paragraph itself.
    `;

    const { text } = await generateText({
      model: google("models/gemini-2.5-flash"),
      prompt: prompt,
    });

    return Response.json({ text: text.trim() });
  } catch (error: any) {
    console.error("Detailed Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
