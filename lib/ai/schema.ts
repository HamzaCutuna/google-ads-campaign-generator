import { z } from "zod";

const AdGroupSchema = z.object({
  name: z.string().min(1).max(80),
  keywords: z.array(z.string().min(1)).min(5).max(15),
  finalUrlHint: z.string().optional(),
});

const CampaignSchema = z.object({
  campaignName: z.string().min(1).max(100),
  adGroups: z.array(AdGroupSchema).min(1).max(6),
});

export const CampaignPlanSchema = z.object({
  brand: z.string().min(1).max(100),
  campaigns: z.array(CampaignSchema).min(1).max(2),
  negatives: z.array(z.string().min(1)).min(50),
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

export function deduplicateAdGroups(plan: CampaignPlan): CampaignPlan {
  return {
    ...plan,
    campaigns: plan.campaigns.map((campaign) => {
      const seen = new Map<string, AdGroup>();

      for (const group of campaign.adGroups) {
        const normalizedName = group.name.toLowerCase().trim();

        if (seen.has(normalizedName)) {
          // Merge keywords into existing group
          const existing = seen.get(normalizedName)!;
          const mergedKeywords = Array.from(
            new Set([...existing.keywords, ...group.keywords])
          ).slice(0, 15);

          seen.set(normalizedName, {
            ...existing,
            keywords: mergedKeywords,
          });
        } else {
          seen.set(normalizedName, group);
        }
      }

      return {
        ...campaign,
        adGroups: Array.from(seen.values()).slice(0, 6),
      };
    }),
  };
}

export function sanitizeCampaignPlan(raw: CampaignPlan): CampaignPlan {
  const sanitized = {
    brand: raw.brand.trim(),
    campaigns: raw.campaigns.map((campaign) => ({
      campaignName: campaign.campaignName.trim(),
      adGroups: campaign.adGroups.map((group) => ({
        name: group.name.trim(),
        keywords: Array.from(new Set(group.keywords.map((k) => k.trim().toLowerCase()))).slice(0, 15),
        finalUrlHint: group.finalUrlHint?.trim(),
      })),
    })),
    negatives: Array.from(new Set(raw.negatives.map((n) => n.trim().toLowerCase()))),
  };

  return deduplicateAdGroups(sanitized);
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

  if (plan.negatives.length < 50) {
    errors.push(`Only ${plan.negatives.length} negatives provided. Minimum required: 50`);
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

export function validateStructureSanity(plan: CampaignPlan): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const campaign of plan.campaigns) {
    // Check distinct ad groups
    const distinctNames = new Set(campaign.adGroups.map((g) => g.name.toLowerCase().trim()));

    if (distinctNames.size < campaign.adGroups.length) {
      errors.push(`Campaign "${campaign.campaignName}" has duplicate ad group names`);
    }

    if (campaign.adGroups.length === 0) {
      errors.push(`Campaign "${campaign.campaignName}" has no ad groups`);
    }

    // Check for NonBrand having 3-6 unique groups
    if (campaign.campaignName.includes("NonBrand") && campaign.adGroups.length < 3) {
      errors.push(`NonBrand campaign must have at least 3 ad groups, found ${campaign.adGroups.length}`);
    }

    // Check keyword distribution (no single ad group should dominate)
    const totalKeywords = campaign.adGroups.reduce((sum, g) => sum + g.keywords.length, 0);
    for (const group of campaign.adGroups) {
      const percentage = (group.keywords.length / totalKeywords) * 100;
      if (percentage > 80) {
        errors.push(
          `Ad group "${group.name}" has ${percentage.toFixed(0)}% of all keywords (should be more balanced)`
        );
      }

      // Check for empty ad groups
      if (group.keywords.length === 0) {
        errors.push(`Ad group "${group.name}" has no keywords`);
      }

      // Check for exact keyword duplicates within ad group
      const uniqueKeywords = new Set(group.keywords.map((k) => k.toLowerCase().trim()));
      if (uniqueKeywords.size < group.keywords.length) {
        errors.push(`Ad group "${group.name}" has duplicate keywords`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
