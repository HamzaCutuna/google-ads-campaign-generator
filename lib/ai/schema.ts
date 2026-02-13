import { z } from "zod";

const AdGroupSchema = z.object({
  name: z.string().min(1).max(80),
  keywords: z.array(z.string().min(1)).min(6).max(10),
  finalUrlHint: z.string().optional(),
});

const CampaignSchema = z.object({
  campaignName: z.string().min(1).max(100),
  adGroups: z.array(AdGroupSchema).min(1).max(7),
});

export const CampaignPlanSchema = z.object({
  brand: z.string().min(1).max(100),
  campaigns: z.array(CampaignSchema).min(1).max(2),
  negatives: z.array(z.string().min(1)).min(100),
});

export type CampaignPlan = z.infer<typeof CampaignPlanSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type AdGroup = z.infer<typeof AdGroupSchema>;

export const AdCopySchema = z.object({
  finalUrl: z.string().min(1),
  headlines: z.array(z.string().min(1).max(30)).length(15),
  descriptions: z.array(z.string().min(1).max(90)).length(4),
});

export type AdCopy = z.infer<typeof AdCopySchema>;

const FORBIDDEN_NAMES = [
  "core offers",
  "high intent",
  "competitor",
  "general",
  "misc",
  "miscellaneous",
  "core products",
  "top category",
  "best sellers",
  "premium products",
  "new arrivals",
  "sale items",
];

export function sanitizeCampaignPlan(raw: CampaignPlan): CampaignPlan {
  return {
    brand: raw.brand.trim(),
    campaigns: raw.campaigns.map((campaign) => ({
      campaignName: campaign.campaignName.trim(),
      adGroups: campaign.adGroups.map((group) => ({
        name: group.name.trim(),
        keywords: Array.from(new Set(group.keywords.map((k) => k.trim().toLowerCase()))).slice(0, 10),
        finalUrlHint: group.finalUrlHint?.trim(),
      })),
    })),
    negatives: Array.from(new Set(raw.negatives.map((n) => n.trim().toLowerCase()))),
  };
}

export function sanitizeAdCopy(raw: AdCopy): AdCopy {
  return {
    finalUrl: raw.finalUrl.trim(),
    headlines: raw.headlines.map((h) => h.trim().slice(0, 30)),
    descriptions: raw.descriptions.map((d) => d.trim().slice(0, 90)),
  };
}

export function validateAdGroupNames(plan: CampaignPlan): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const campaign of plan.campaigns) {
    for (const group of campaign.adGroups) {
      const normalized = group.name.toLowerCase().trim();
      if (FORBIDDEN_NAMES.includes(normalized)) {
        errors.push(`Forbidden generic ad group name: "${group.name}"`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateCopyUniqueness(copies: AdCopy[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (let i = 0; i < copies.length; i++) {
    for (let j = i + 1; j < copies.length; j++) {
      const headlinesA = copies[i].headlines.map((h) => h.toLowerCase());
      const headlinesB = copies[j].headlines.map((h) => h.toLowerCase());

      const overlap = headlinesA.filter((h) => headlinesB.includes(h)).length;

      if (overlap > 5) {
        errors.push(`Ad groups ${i + 1} and ${j + 1} have ${overlap}/15 identical headlines (must have at least 10/15 different)`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateNegativesCount(plan: CampaignPlan): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (plan.negatives.length < 100) {
    errors.push(`Only ${plan.negatives.length} negatives provided. Minimum required: 100`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateNegativesAgainstPositiveTerms(
  negatives: string[],
  positiveTerms: string[]
): { valid: boolean; errors: string[]; filtered: string[] } {
  const errors: string[] = [];
  const positiveSet = new Set(positiveTerms.map((t) => t.toLowerCase().trim()));

  const conflicts: string[] = [];
  const filtered = negatives.filter((neg) => {
    const normalized = neg.toLowerCase().trim();
    if (positiveSet.has(normalized)) {
      conflicts.push(neg);
      return false;
    }
    return true;
  });

  if (conflicts.length > 0) {
    errors.push(`Found ${conflicts.length} negatives that conflict with positive terms: ${conflicts.slice(0, 5).join(", ")}${conflicts.length > 5 ? "..." : ""}`);
  }

  return { valid: conflicts.length === 0, errors, filtered };
}

export function validateNoShopifyMention(text: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (text.toLowerCase().includes("shopify")) {
    errors.push("Text contains 'Shopify' mention which should be removed");
  }

  return { valid: errors.length === 0, errors };
}
