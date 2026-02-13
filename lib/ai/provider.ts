import { GroqProvider } from "./groq";

export interface AIProvider {
  chatJSON(
    systemPrompt: string,
    userPrompt: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string>;
}

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "groq";
  console.log(`[AI Provider] Creating provider: ${provider}`);

  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("[AI Provider] FATAL: GROQ_API_KEY environment variable is not set!");
      throw new Error("GROQ_API_KEY is required when AI_PROVIDER=groq. Please set it in Netlify environment variables.");
    }
    console.log(`[AI Provider] GROQ_API_KEY found (length: ${apiKey.length})`);
    return new GroqProvider(apiKey);
  }

  throw new Error(`Unknown AI_PROVIDER: ${provider}`);
}

export function safeParseJSON<T>(text: string): T {
  let cleaned = text.trim();

  // Remove markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  // Try direct parse
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Extract first JSON object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as T;
    }
    throw new Error("Could not parse JSON from response");
  }
}
