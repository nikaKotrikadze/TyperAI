// src/app/api/generate/route.ts
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Generate a single paragraph for a typing race about: ${topic}. 25 words max. No intro.`,
    });

    return Response.json({ text: text.trim() });
  } catch (error: any) {
    console.error("Detailed Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
