export type Tier = "free" | "pro" | "business" | "enterprise";

export const TIER_LIMITS: Record<Tier, { dailyScrapes: number; aiEnabled: boolean; bulkExport: boolean; label: string }> = {
  free: { dailyScrapes: 10, aiEnabled: false, bulkExport: false, label: "Free" },
  pro: { dailyScrapes: 200, aiEnabled: true, bulkExport: false, label: "Pro" },
  business: { dailyScrapes: 1000, aiEnabled: true, bulkExport: true, label: "Business" },
  enterprise: { dailyScrapes: 100000, aiEnabled: true, bulkExport: true, label: "Enterprise" },
};

export const PLANS = [
  {
    tier: "free" as Tier,
    name: "Free",
    price: 0,
    priceLabel: "$0",
    period: "forever",
    features: [
      "10 scrapes per day",
      "Up to 500 resources per scrape",
      "ZIP export",
      "Scrape history",
    ],
    cta: "Current plan",
    highlight: false,
  },
  {
    tier: "pro" as Tier,
    name: "Pro",
    price: 15,
    priceLabel: "$15",
    period: "per month",
    features: [
      "200 scrapes per day",
      "AI Studio: summaries, SEO, keywords, tech stack",
      "Priority queue",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    tier: "business" as Tier,
    name: "Business",
    price: 49,
    priceLabel: "$49",
    period: "per month",
    features: [
      "1,000 scrapes per day",
      "Everything in Pro",
      "Bulk URL export (CSV/JSON)",
      "API access",
      "Priority support",
    ],
    cta: "Upgrade to Business",
    highlight: false,
  },
  {
    tier: "enterprise" as Tier,
    name: "Enterprise",
    price: null,
    priceLabel: "Custom",
    period: "contact sales",
    features: [
      "Unlimited scrapes",
      "Dedicated infrastructure",
      "SLA + SSO + audit logs",
      "Custom integrations",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];
