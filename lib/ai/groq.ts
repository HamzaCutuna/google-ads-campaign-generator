import { AIProvider } from "./provider";

interface GroqChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqChatRequest {
  model: string;
  messages: GroqChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
}

interface GroqChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GroqProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatJSON(
    systemPrompt: string,
    userPrompt: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const model = this.getModel(systemPrompt);
    const maxTokens = options?.maxTokens || 1400;
    const temperature = options?.temperature ?? 0.2;

    console.log(`[Groq] Making API call with model: ${model}`);
    console.log(`[Groq] Parameters: maxTokens=${maxTokens}, temperature=${temperature}`);

    const request: GroqChatRequest = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    };

    console.log(`[Groq] Calling ${this.baseUrl}/chat/completions...`);
    const startTime = Date.now();

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Groq] API response received in ${elapsed}ms, status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Groq] API error (${response.status}):`, errorText);
      throw new Error(`Groq API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as GroqChatResponse;
    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error("[Groq] API returned empty content");
      throw new Error("Groq API returned empty content");
    }

    console.log(`[Groq] Success! Response length: ${content.length} characters`);
    return content;
  }

  private getModel(systemPrompt: string): string {
    // Use AI_MODEL_COPY for ad copy, AI_MODEL_PLAN for campaign planning
    if (systemPrompt.includes("Google Ads copywriter")) {
      return process.env.AI_MODEL_COPY || "llama-3.1-70b-versatile";
    }
    return process.env.AI_MODEL_PLAN || "llama-3.1-70b-versatile";
  }
}
