import { NextResponse } from "next/server";
import { generateAdsKitZip } from "@/lib/adskit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      storeUrl?: string;
      description?: string;
      country?: string;
    };

    const storeUrl = body.storeUrl?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const country = body.country?.trim() ?? "";

    if (!storeUrl || !description || !country) {
      return NextResponse.json(
        { error: "Missing required fields: storeUrl, description, country." },
        { status: 400 },
      );
    }

    const zip = await generateAdsKitZip({ storeUrl, description, country });
    const bytes = new Uint8Array(zip);

    // Extract domain for filename
    const domain = new URL(storeUrl).hostname.replace("www.", "");
    const brandName = domain.split(".")[0];
    const filename = `adskit-${brandName}-campaign.zip`;

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate kit.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
