import { NextResponse } from "next/server";
import { generateAdsKitZip } from "@/lib/adskit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  console.log("========================================");
  console.log("API /generate POST called");
  console.log("Environment check:");
  console.log("- GROQ_API_KEY:", process.env.GROQ_API_KEY ? "SET (length: " + process.env.GROQ_API_KEY.length + ")" : "NOT SET");
  console.log("- AI_PROVIDER:", process.env.AI_PROVIDER || "NOT SET");
  console.log("- AI_MODEL_PLAN:", process.env.AI_MODEL_PLAN || "NOT SET");
  console.log("- AI_MODEL_COPY:", process.env.AI_MODEL_COPY || "NOT SET");
  console.log("========================================");

  try {
    const body = (await request.json()) as {
      storeUrl?: string;
      description?: string;
      country?: string;
    };

    const storeUrl = body.storeUrl?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const country = body.country?.trim() ?? "";

    console.log("Request body:", { storeUrl, description: description.substring(0, 100) + "...", country });

    if (!storeUrl || !description || !country) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: storeUrl, description, country." },
        { status: 400 },
      );
    }

    console.log("Calling generateAdsKitZip...");
    const zip = await generateAdsKitZip({ storeUrl, description, country });
    const bytes = new Uint8Array(zip);

    // Extract domain for filename
    const domain = new URL(storeUrl).hostname.replace("www.", "");
    const brandName = domain.split(".")[0];
    const filename = `adskit-${brandName}-campaign.zip`;

    console.log("ZIP generated successfully, size:", bytes.length, "bytes");
    console.log("========================================");

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("========================================");
    console.error("FATAL ERROR in /api/generate:");
    console.error(error);
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");
    console.error("========================================");
    const message = error instanceof Error ? error.message : "Unable to generate kit.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
