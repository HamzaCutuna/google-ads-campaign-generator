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

  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is required when AI_PROVIDER=groq");
    }
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
