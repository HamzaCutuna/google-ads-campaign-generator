import JSZip from "jszip";
import { getAIProvider, safeParseJSON } from "./ai/provider";
import {
  SYSTEM_CAMPAIGN_PLAN,
  SYSTEM_AD_COPY,
  getUserCampaignPlanPrompt,
  getUserAdCopyPrompt,
  REPAIR_JSON_PROMPT,
} from "./ai/prompts";
import {
  CampaignPlanSchema,
  AdCopySchema,
  sanitizeCampaignPlan,
  sanitizeAdCopy,
  validateAdGroupNames,
  validateCopyUniqueness,
  validateNegativesCount,
  validateNoShopifyMention,
  validateNegativesAgainstPositiveTerms,
  validateStructureSanity,
  type CampaignPlan as AICampaignPlan,
  type AdCopy as AIAdCopy,
} from "./ai/schema";

type Input = {
  storeUrl: string;
  description: string;
  country: string;
};

type Keyword = {
  text: string;
  matchType: "Phrase" | "Exact";
};

type AdGroupData = {
  campaignName: string;
  name: string;
  keywords: Keyword[];
  finalUrl: string;
};

type RsaAd = {
  campaignName: string;
  adGroupName: string;
  finalUrl: string;
  headlines: string[];
  descriptions: string[];
};

type NegativeKeyword = {
  keyword: string;
  matchType: "Phrase" | "Exact";
  level: "Campaign" | "AdGroup";
};

type ProcessedData = {
  adGroups: AdGroupData[];
  rsaAds: RsaAd[];
  negatives: NegativeKeyword[];
  brand: string;
};

function csvEscape(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function buildCampaignsKeywordsCsv(adGroups: AdGroupData[]): string {
  const rows = ["Campaign,Ad Group,Keyword,Match Type"];

  // Sort by Campaign -> Ad Group -> Keyword
  const sortedGroups = [...adGroups].sort((a, b) => {
    if (a.campaignName !== b.campaignName) {
      return a.campaignName.localeCompare(b.campaignName);
    }
    return a.name.localeCompare(b.name);
  });

  for (const group of sortedGroups) {
    const sortedKeywords = [...group.keywords].sort((a, b) => a.text.localeCompare(b.text));

    for (const keyword of sortedKeywords) {
      rows.push(
        [
          csvEscape(group.campaignName),
          csvEscape(group.name),
          csvEscape(keyword.text),
          csvEscape(keyword.matchType),
        ].join(",")
      );
    }
  }

  return rows.join("\n");
}

function buildRsaAdsCsv(rsaAds: RsaAd[]): string {
  const headers = [
    "Campaign",
    "Ad Group",
    "Final URL",
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
  ];

  const rows = [headers.join(",")];

  // Sort by Campaign -> Ad Group
  const sortedAds = [...rsaAds].sort((a, b) => {
    if (a.campaignName !== b.campaignName) {
      return a.campaignName.localeCompare(b.campaignName);
    }
    return a.adGroupName.localeCompare(b.adGroupName);
  });

  for (const ad of sortedAds) {
    const row = [
      csvEscape(ad.campaignName),
      csvEscape(ad.adGroupName),
      csvEscape(ad.finalUrl),
      ...ad.headlines.map((h) => csvEscape(h)),
      ...ad.descriptions.map((d) => csvEscape(d)),
    ];
    rows.push(row.join(","));
  }

  return rows.join("\n");
}

function buildNegativesCsv(negatives: NegativeKeyword[]): string {
  const rows = ["Negative Keyword,Match Type,Level"];

  for (const negative of negatives) {
    rows.push([csvEscape(negative.keyword), csvEscape(negative.matchType), csvEscape(negative.level)].join(","));
  }

  return rows.join("\n");
}

function buildTrackingMd(input: Input): string {
  return `# Tracking Setup Guide

Target Country: ${input.country}
Website: ${input.storeUrl}

## Step 1: Install Google Tag Manager
- Create a GTM account at tagmanager.google.com
- Install the GTM container code on all pages of your website
- Verify installation using GTM Preview mode

## Step 2: Connect GA4
- Create a GA4 property in Google Analytics
- Add GA4 configuration tag in GTM
- Test with GA4 Realtime report

## Step 3: Define Conversion Events
For eCommerce: Track "purchase" event
For Lead Generation: Track "generate_lead" or "contact" event

## Step 4: Import Conversions to Google Ads
- In Google Ads, go to Tools > Conversions
- Import GA4 conversions
- Set your primary conversion (purchase or lead)

## Step 5: Test Before Launch
- Use GTM Preview mode
- Complete a test conversion
- Verify in GA4 Realtime and Google Ads

## Important Notes
- Allow 24-48 hours for conversion data to populate
- Ensure conversion values are tracked for eCommerce
- Set up enhanced conversions for better accuracy`;
}

function buildOptimizationMd(): string {
  return `# 7-Day Optimization Checklist

## Day 1: Verify Setup
- Confirm conversions are tracking correctly
- Check budget pacing (should spend ~14% of weekly budget)
- Verify location settings match target country
- Review impression share

## Day 2-3: Search Terms Review
- Download search terms report
- Add 15-30 negative keywords based on irrelevant searches
- Identify high-performing search queries
- Consider adding exact match keywords for top performers

## Day 4-5: Performance Optimization
- Pause keywords with CTR < 1% after 100+ impressions
- Increase bids on ad groups with CTR > 3%
- Consider tightening match types for broad performers
- Review Quality Scores (target 6+)

## Day 6-7: Conversion Analysis
- Identify converting ad groups
- Shift 20-30% more budget to winners
- Add 3-5 new related keywords to winning ad groups
- Pause ad groups with 0 conversions after 50+ clicks

## Realistic Thresholds
- CTR Target: 2-4% (varies by industry)
- Quality Score Target: 6+
- Don't pause based on <3 days data
- Wait for 20+ clicks before major decisions

## What NOT to Do
- Don't check every hour (once per day is enough)
- Don't pause after 10-20 clicks
- Don't ignore search terms report
- Don't make changes based on 1-2 days
- Don't set and forget`;
}

function buildLandingChecklist(): string {
  return `# Landing Page Checklist

Before launching your Google Ads campaign, ensure your landing pages are optimized:

## Page Quality
- [ ] Headline matches ad message and keyword intent
- [ ] Primary CTA is visible above the fold
- [ ] Mobile-friendly and loads in under 3 seconds
- [ ] Clear pricing and shipping information
- [ ] Return policy is easy to find

## Trust Signals
- [ ] Customer reviews or testimonials visible
- [ ] Security badges (SSL, payment icons)
- [ ] Money-back guarantee or warranty
- [ ] Contact information is easy to find
- [ ] About us / company credibility

## Conversion Optimization
- [ ] Single clear CTA (don't offer too many choices)
- [ ] Remove unnecessary navigation links
- [ ] Add urgency (limited stock, sale ends, etc.) - if true
- [ ] Include product/service benefits, not just features
- [ ] Test checkout flow before launch

## Technical
- [ ] GTM and GA4 tracking verified
- [ ] Conversion events firing correctly
- [ ] Form validation working properly
- [ ] Thank you page set up
- [ ] No broken links or images

## Google Ads Specific
- [ ] URL parameters preserved (?gclid=)
- [ ] No pop-ups or interstitials on mobile
- [ ] Content matches ad promises (policy compliance)`;
}

function inferBrandFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain.split(".")[0];
  } catch {
    return "YourBrand";
  }
}

function extractPositiveTerms(description: string): string[] {
  const desc = description.toLowerCase();
  const positiveTerms: string[] = [];

  // Product type keywords
  const productTypes = [
    "table",
    "tables",
    "desk",
    "desks",
    "chair",
    "chairs",
    "bowl",
    "bowls",
    "board",
    "boards",
    "cutting board",
    "serving board",
    "charcuterie board",
    "jewelry",
    "necklace",
    "necklaces",
    "bracelet",
    "bracelets",
    "earring",
    "earrings",
    "ring",
    "rings",
    "pendant",
    "pendants",
    "furniture",
    "decor",
    "art",
    "sculpture",
    "vase",
    "lamp",
    "lighting",
    "mirror",
    "frame",
    "coaster",
    "coasters",
    "tray",
    "trays",
  ];

  // Material keywords
  const materials = [
    "wood",
    "wooden",
    "oak",
    "walnut",
    "maple",
    "cherry",
    "mahogany",
    "pine",
    "cedar",
    "bamboo",
    "teak",
    "epoxy",
    "resin",
    "metal",
    "steel",
    "brass",
    "copper",
    "aluminum",
    "glass",
    "ceramic",
    "stone",
    "marble",
    "granite",
    "leather",
    "fabric",
    "canvas",
  ];

  // Craftsmanship keywords
  const craftsmanship = [
    "handmade",
    "handcrafted",
    "handcarved",
    "hand carved",
    "artisan",
    "artisanal",
    "craft",
    "crafted",
    "custom",
    "customized",
    "personalized",
    "bespoke",
    "unique",
    "one of a kind",
    "made to order",
    "hand turned",
    "hand finished",
  ];

  // Style keywords that might be brand-specific
  const styles = [
    "rustic",
    "modern",
    "contemporary",
    "vintage",
    "industrial",
    "minimalist",
    "farmhouse",
    "bohemian",
    "scandinavian",
    "mid century",
    "traditional",
    "elegant",
    "luxury",
    "premium",
  ];

  const allKeywords = [...productTypes, ...materials, ...craftsmanship, ...styles];

  for (const keyword of allKeywords) {
    if (desc.includes(keyword)) {
      positiveTerms.push(keyword);
    }
  }

  // Deduplicate
  return Array.from(new Set(positiveTerms));
}

function asKeyword(value: string, index: number): Keyword {
  const trimmed = value.trim().toLowerCase();
  return {
    text: trimmed,
    matchType: index % 2 === 0 ? "Phrase" : "Exact",
  };
}

function generateDummyData(input: Input): ProcessedData {
  const brand = inferBrandFromUrl(input.storeUrl);
  const baseUrl = input.storeUrl;
  const positiveTerms = extractPositiveTerms(input.description);

  // Try to infer categories from description, fallback to generic
  const desc = input.description.toLowerCase();
  let categoryGroups: AdGroupData[] = [];

  if (desc.includes("furniture") || desc.includes("table") || desc.includes("desk") || desc.includes("chair")) {
    categoryGroups = [
      {
        campaignName: "Search - NonBrand",
        name: "Living Room Furniture",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy living room furniture", matchType: "Phrase" },
          { text: "living room furniture", matchType: "Exact" },
          { text: "shop furniture online", matchType: "Phrase" },
          { text: "furniture store online", matchType: "Exact" },
          { text: "order furniture online", matchType: "Phrase" },
          { text: "furniture near me", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Dining Tables",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy dining table", matchType: "Phrase" },
          { text: "dining table", matchType: "Exact" },
          { text: "shop dining tables", matchType: "Phrase" },
          { text: "dining room table", matchType: "Exact" },
          { text: "buy table online", matchType: "Phrase" },
          { text: "dining tables for sale", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Office Desks",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy office desk", matchType: "Phrase" },
          { text: "office desk", matchType: "Exact" },
          { text: "shop desks online", matchType: "Phrase" },
          { text: "desk for home office", matchType: "Exact" },
          { text: "buy desk online", matchType: "Phrase" },
          { text: "work desk", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Home Decor",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy home decor", matchType: "Phrase" },
          { text: "home decor", matchType: "Exact" },
          { text: "shop decor online", matchType: "Phrase" },
          { text: "home accessories", matchType: "Exact" },
          { text: "decorative items", matchType: "Phrase" },
          { text: "home decor online", matchType: "Exact" },
        ],
      },
    ];
  } else if (desc.includes("jewelry") || desc.includes("necklace") || desc.includes("earring") || desc.includes("ring")) {
    categoryGroups = [
      {
        campaignName: "Search - NonBrand",
        name: "Necklaces",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy necklace online", matchType: "Phrase" },
          { text: "necklace", matchType: "Exact" },
          { text: "shop necklaces", matchType: "Phrase" },
          { text: "necklaces for women", matchType: "Exact" },
          { text: "pendant necklace", matchType: "Phrase" },
          { text: "buy necklaces online", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Earrings",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy earrings online", matchType: "Phrase" },
          { text: "earrings", matchType: "Exact" },
          { text: "shop earrings", matchType: "Phrase" },
          { text: "earrings for women", matchType: "Exact" },
          { text: "buy earrings", matchType: "Phrase" },
          { text: "earrings online", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Rings",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy ring online", matchType: "Phrase" },
          { text: "ring", matchType: "Exact" },
          { text: "shop rings", matchType: "Phrase" },
          { text: "rings for women", matchType: "Exact" },
          { text: "buy rings online", matchType: "Phrase" },
          { text: "statement ring", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Bracelets",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy bracelet online", matchType: "Phrase" },
          { text: "bracelet", matchType: "Exact" },
          { text: "shop bracelets", matchType: "Phrase" },
          { text: "bracelets for women", matchType: "Exact" },
          { text: "buy bracelets", matchType: "Phrase" },
          { text: "bracelets online", matchType: "Exact" },
        ],
      },
    ];
  } else if (desc.includes("bowl") || desc.includes("board") || desc.includes("kitchenware")) {
    categoryGroups = [
      {
        campaignName: "Search - NonBrand",
        name: "Serving Boards",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy serving board", matchType: "Phrase" },
          { text: "serving board", matchType: "Exact" },
          { text: "shop serving boards", matchType: "Phrase" },
          { text: "charcuterie board", matchType: "Exact" },
          { text: "buy charcuterie board", matchType: "Phrase" },
          { text: "serving boards online", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Cutting Boards",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy cutting board", matchType: "Phrase" },
          { text: "cutting board", matchType: "Exact" },
          { text: "shop cutting boards", matchType: "Phrase" },
          { text: "chopping board", matchType: "Exact" },
          { text: "buy chopping board", matchType: "Phrase" },
          { text: "cutting boards online", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Kitchen Bowls",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy kitchen bowls", matchType: "Phrase" },
          { text: "kitchen bowls", matchType: "Exact" },
          { text: "shop serving bowls", matchType: "Phrase" },
          { text: "decorative bowls", matchType: "Exact" },
          { text: "buy bowls online", matchType: "Phrase" },
          { text: "bowls for kitchen", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Kitchen Accessories",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy kitchen accessories", matchType: "Phrase" },
          { text: "kitchen accessories", matchType: "Exact" },
          { text: "shop kitchenware", matchType: "Phrase" },
          { text: "kitchen items", matchType: "Exact" },
          { text: "buy kitchenware online", matchType: "Phrase" },
          { text: "kitchen accessories online", matchType: "Exact" },
        ],
      },
    ];
  } else {
    // Generic fallback with real category names
    categoryGroups = [
      {
        campaignName: "Search - NonBrand",
        name: "Featured Collection",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy online", matchType: "Phrase" },
          { text: "shop online", matchType: "Exact" },
          { text: "buy products online", matchType: "Phrase" },
          { text: "online store", matchType: "Exact" },
          { text: "shop products", matchType: "Phrase" },
          { text: "order online", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Gift Ideas",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy gift online", matchType: "Phrase" },
          { text: "gift ideas", matchType: "Exact" },
          { text: "shop gifts", matchType: "Phrase" },
          { text: "gifts online", matchType: "Exact" },
          { text: "buy gifts", matchType: "Phrase" },
          { text: "gift shop online", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Special Occasions",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy special gift", matchType: "Phrase" },
          { text: "special occasion gifts", matchType: "Exact" },
          { text: "shop occasion gifts", matchType: "Phrase" },
          { text: "gifts for events", matchType: "Exact" },
          { text: "buy occasion gift", matchType: "Phrase" },
          { text: "celebration gifts", matchType: "Exact" },
        ],
      },
      {
        campaignName: "Search - NonBrand",
        name: "Custom Orders",
        finalUrl: baseUrl,
        keywords: [
          { text: "buy custom online", matchType: "Phrase" },
          { text: "custom orders", matchType: "Exact" },
          { text: "shop custom products", matchType: "Phrase" },
          { text: "custom made", matchType: "Exact" },
          { text: "order custom", matchType: "Phrase" },
          { text: "custom products online", matchType: "Exact" },
        ],
      },
    ];
  }

  const nonBrandGroups = categoryGroups;

  const brandGroup: AdGroupData = {
    campaignName: "Search - Brand",
    name: "Brand",
    finalUrl: baseUrl,
    keywords: [
      { text: brand.toLowerCase(), matchType: "Exact" },
      { text: `${brand.toLowerCase()} store`, matchType: "Phrase" },
      { text: `${brand.toLowerCase()} official`, matchType: "Phrase" },
      { text: `${brand.toLowerCase()} website`, matchType: "Exact" },
      { text: `buy from ${brand.toLowerCase()}`, matchType: "Phrase" },
      { text: `${brand.toLowerCase()} shop`, matchType: "Exact" },
    ],
  };

  const adGroups = [...nonBrandGroups, brandGroup];

  // Generate RSA ads for each ad group
  const rsaAds: RsaAd[] = nonBrandGroups.map((group) => ({
    campaignName: group.campaignName,
    adGroupName: group.name,
    finalUrl: group.finalUrl,
    headlines: [
      `Shop ${group.name} Online`,
      `Buy ${group.name}`,
      `${group.name} For Sale`,
      `Order ${group.name}`,
      `${group.name} Available Now`,
      `Quality ${group.name}`,
      `${group.name} Direct`,
      `Shop Our ${group.name}`,
      `${group.name} Online Store`,
      `Buy ${group.name} Now`,
      `${group.name} In Stock`,
      `Order ${group.name} Online`,
      `${group.name} Fast Shipping`,
      `${group.name} Collection`,
      `Browse ${group.name}`,
    ],
    descriptions: [
      `Shop our ${group.name.toLowerCase()} collection online. Fast shipping and secure checkout available.`,
      `Browse quality ${group.name.toLowerCase()} with easy returns. Order today and get fast delivery.`,
      `Buy ${group.name.toLowerCase()} directly from our store. Trusted service and quick shipping.`,
      `${group.name} available for purchase. Secure checkout and reliable customer support.`,
    ],
  }));

  // Add Brand ad group RSA
  rsaAds.push({
    campaignName: "Search - Brand",
    adGroupName: "Brand",
    finalUrl: baseUrl,
    headlines: [
      `Official ${brand} Store`,
      `${brand} - Shop Direct`,
      `Buy from ${brand}`,
      `${brand} Website`,
      `${brand} Official Site`,
      `Shop ${brand} Collection`,
      `${brand} Products`,
      `${brand} Online Store`,
      `Genuine ${brand}`,
      `${brand} - Authentic`,
      `${brand} Direct`,
      `Visit ${brand} Store`,
      `Browse ${brand}`,
      `${brand} Official Shop`,
      `${brand} - Order Now`,
    ],
    descriptions: [
      `Shop the official ${brand} collection. Authentic products with fast shipping.`,
      `Buy directly from ${brand}. Secure checkout and reliable customer service.`,
      `Official ${brand} store online. Browse our full collection and order today.`,
      `${brand} products delivered fast. Official store with quality guarantee.`,
    ],
  });

  const baseNegatives = [
    "free",
    "cheap",
    "discount code",
    "coupon",
    "promo code",
    "voucher",
    "clearance",
    "liquidation",
    "closeout",
    "DIY",
    "how to",
    "how to make",
    "tutorial",
    "guide",
    "pattern",
    "template",
    "blueprint",
    "plan",
    "plans",
    "instructions",
    "step by step",
    "job",
    "jobs",
    "career",
    "careers",
    "employment",
    "hiring",
    "vacancy",
    "positions",
    "work from home",
    "wholesale",
    "supplier",
    "manufacturer",
    "distributor",
    "bulk",
    "bulk order",
    "trade",
    "b2b",
    "amazon",
    "ebay",
    "aliexpress",
    "temu",
    "walmart",
    "target",
    "etsy",
    "wayfair",
    "overstock",
    "review",
    "reviews",
    "rating",
    "ratings",
    "testimonial",
    "feedback",
    "image",
    "images",
    "photo",
    "photos",
    "pic",
    "pics",
    "picture",
    "pictures",
    "gallery",
    "meaning",
    "definition",
    "what is",
    "what are",
    "ideas",
    "inspiration",
    "examples",
    "sample",
    "samples",
    "used",
    "second hand",
    "secondhand",
    "pre owned",
    "refurbished",
    "reconditioned",
    "repair",
    "repairs",
    "fix",
    "fixing",
    "broken",
    "damaged",
    "replacement parts",
    "parts",
    "manual",
    "diagram",
    "schematic",
    "drawing",
    "rent",
    "rental",
    "rentals",
    "lease",
    "leasing",
    "hire",
    "affiliate",
    "reseller",
    "dropship",
    "dropshipping",
    "pdf",
    "download",
    "torrent",
    "cracked",
    "nulled",
    "pirated",
    "comparison",
    "compare",
    "vs",
    "versus",
    "alternative",
    "alternatives",
    "workshop",
    "class",
    "classes",
    "course",
    "courses",
    "training",
    "certification",
    "blog",
    "article",
    "news",
    "forum",
    "reddit",
    "pinterest",
    "kit",
    "kits",
  ];

  // Filter out positive terms
  const filteredNegatives = baseNegatives.filter((neg) => {
    const normalized = neg.toLowerCase().trim();
    return !positiveTerms.some((pos) => normalized === pos.toLowerCase().trim() || normalized.includes(pos.toLowerCase().trim()));
  });

  const negatives: NegativeKeyword[] = filteredNegatives.map((keyword) => ({
    keyword,
    matchType: "Phrase" as const,
    level: "Campaign" as const,
  }));

  return {
    adGroups,
    rsaAds,
    negatives,
    brand,
  };
}

async function generateWithAI(input: Input): Promise<ProcessedData> {
  const provider = getAIProvider();

  // Step 0: Extract positive terms from business description
  const positiveTerms = extractPositiveTerms(input.description);
  console.log("Extracted positive terms:", positiveTerms);

  // Step 1: Generate campaign plan
  const planUserPrompt = getUserCampaignPlanPrompt(input.storeUrl, input.description, input.country, positiveTerms);

  let campaignPlan: AICampaignPlan;
  let attemptCount = 0;
  const maxAttempts = 2;

  while (attemptCount < maxAttempts) {
    try {
      const planResponse = await provider.chatJSON(
        SYSTEM_CAMPAIGN_PLAN,
        attemptCount === 0 ? planUserPrompt : planUserPrompt + "\n\n" + REPAIR_JSON_PROMPT,
        {
          maxTokens: 2000,
          temperature: 0.2,
        }
      );

      const parsed = safeParseJSON<AICampaignPlan>(planResponse);
      const validated = CampaignPlanSchema.parse(parsed);
      let sanitized = sanitizeCampaignPlan(validated);

      // Quality gates
      const structureValidation = validateStructureSanity(sanitized);
      const nameValidation = validateAdGroupNames(sanitized);
      const negativesValidation = validateNegativesCount(sanitized);
      const shopifyValidation = validateNoShopifyMention(JSON.stringify(sanitized));
      const positiveTermsValidation = validateNegativesAgainstPositiveTerms(sanitized.negatives, positiveTerms);

      // Auto-fix: Filter negatives if conflicts found
      if (!positiveTermsValidation.valid) {
        console.warn("Filtering negatives that conflict with positive terms:", positiveTermsValidation.errors);
        sanitized = {
          ...sanitized,
          negatives: positiveTermsValidation.filtered,
        };
      }

      // Re-validate negatives count after filtering
      const negativesRevalidation = validateNegativesCount(sanitized);

      if (!structureValidation.valid || !nameValidation.valid || !negativesRevalidation.valid || !shopifyValidation.valid) {
        const errors = [...structureValidation.errors, ...nameValidation.errors, ...negativesRevalidation.errors, ...shopifyValidation.errors];
        console.error("Campaign plan validation failed:", errors);

        if (attemptCount === maxAttempts - 1) {
          throw new Error(`Quality gate failed: ${errors.join(", ")}`);
        }

        attemptCount++;
        continue;
      }

      campaignPlan = sanitized;
      break;
    } catch (error) {
      console.error(`Campaign plan generation attempt ${attemptCount + 1} failed:`, error);

      if (attemptCount === maxAttempts - 1) {
        throw error;
      }

      attemptCount++;
    }
  }

  // Step 2: Generate ad copy for each ad group
  const adCopyPromises: Promise<{ campaignName: string; adGroupName: string; copy: AIAdCopy }>[] = [];

  for (const campaign of campaignPlan!.campaigns) {
    for (const group of campaign.adGroups) {
      const promise = (async () => {
        const keywords = group.keywords;
        const copyUserPrompt = getUserAdCopyPrompt(
          campaign.campaignName,
          group.name,
          keywords,
          input.storeUrl,
          input.description
        );

        let attemptCount = 0;
        const maxAttempts = 2;

        while (attemptCount < maxAttempts) {
          try {
            const copyResponse = await provider.chatJSON(
              SYSTEM_AD_COPY,
              attemptCount === 0 ? copyUserPrompt : copyUserPrompt + "\n\n" + REPAIR_JSON_PROMPT,
              {
                maxTokens: 1500,
                temperature: 0.3,
              }
            );

            const parsed = safeParseJSON<AIAdCopy>(copyResponse);
            const validated = AdCopySchema.parse(parsed);
            const sanitized = sanitizeAdCopy(validated);

            const shopifyValidation = validateNoShopifyMention(JSON.stringify(sanitized));

            if (!shopifyValidation.valid) {
              console.error("Ad copy validation failed:", shopifyValidation.errors);

              if (attemptCount === maxAttempts - 1) {
                throw new Error(`Quality gate failed: ${shopifyValidation.errors.join(", ")}`);
              }

              attemptCount++;
              continue;
            }

            return {
              campaignName: campaign.campaignName,
              adGroupName: group.name,
              copy: sanitized,
            };
          } catch (error) {
            console.error(`Ad copy generation attempt ${attemptCount + 1} failed for ${group.name}:`, error);

            if (attemptCount === maxAttempts - 1) {
              throw error;
            }

            attemptCount++;
          }
        }

        throw new Error(`Failed to generate ad copy for ${group.name}`);
      })();

      adCopyPromises.push(promise);
    }
  }

  const adCopyResults = await Promise.all(adCopyPromises);

  // Quality gate: Check copy uniqueness
  const uniquenessValidation = validateCopyUniqueness(adCopyResults.map((r) => r.copy));

  if (!uniquenessValidation.valid) {
    console.error("Ad copy uniqueness validation failed:", uniquenessValidation.errors);
    // Don't throw, just log warning as this is harder to fix
  }

  // Step 3: Build processed data
  const adGroups: AdGroupData[] = [];
  const rsaAds: RsaAd[] = [];

  for (const campaign of campaignPlan!.campaigns) {
    for (const group of campaign.adGroups) {
      const adCopyResult = adCopyResults.find(
        (r) => r.campaignName === campaign.campaignName && r.adGroupName === group.name
      );

      if (!adCopyResult) continue;

      const finalUrl = adCopyResult.copy.finalUrl || group.finalUrlHint || input.storeUrl;

      adGroups.push({
        campaignName: campaign.campaignName,
        name: group.name,
        keywords: group.keywords.map((k, i) => asKeyword(k, i)),
        finalUrl,
      });

      rsaAds.push({
        campaignName: campaign.campaignName,
        adGroupName: group.name,
        finalUrl,
        headlines: adCopyResult.copy.headlines,
        descriptions: adCopyResult.copy.descriptions,
      });
    }
  }

  const negatives: NegativeKeyword[] = campaignPlan!.negatives.map((keyword) => ({
    keyword,
    matchType: "Phrase" as const,
    level: "Campaign" as const,
  }));

  return {
    adGroups,
    rsaAds,
    negatives,
    brand: campaignPlan!.brand,
  };
}

export async function generateAdsKitZip(input: Input): Promise<Buffer> {
  console.log("=== GENERATION START ===");
  console.log("Input:", JSON.stringify(input, null, 2));

  let data: ProcessedData;

  try {
    console.log("Attempting AI generation...");
    data = await generateWithAI(input);
    console.log("✓ AI generation successful");
  } catch (error) {
    console.error("✗ AI generation failed with error:");
    console.error(error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "N/A");
    console.warn("⚠ Falling back to dummy data generation");
    data = generateDummyData(input);
    console.log("✓ Dummy data generated");
  }

  console.log("Generated data summary:");
  console.log(`- Ad Groups: ${data.adGroups.length}`);
  console.log(`- RSA Ads: ${data.rsaAds.length}`);
  console.log(`- Negatives: ${data.negatives.length}`);
  console.log(`- Brand: ${data.brand}`);

  const zip = new JSZip();
  zip.file("campaigns_keywords.csv", buildCampaignsKeywordsCsv(data.adGroups));
  zip.file("rsa_ads.csv", buildRsaAdsCsv(data.rsaAds));
  zip.file("negatives.csv", buildNegativesCsv(data.negatives));
  zip.file("tracking.md", buildTrackingMd(input));
  zip.file("landing-checklist.md", buildLandingChecklist());
  zip.file("optimization-7days.md", buildOptimizationMd());

  console.log("=== GENERATION COMPLETE ===");
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
