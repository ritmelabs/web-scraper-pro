import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Guest",
    price: "$0",
    period: "forever",
    desc: "Try SiteHarvest with no account.",
    cta: "Try as guest",
    to: "/guest" as const,
    highlight: false,
    features: [
      "2 scans per day",
      "Up to 50 resources / scan",
      "Basic resource extraction",
      "Watermarked export",
      "No history",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    desc: "For individuals shipping real data workflows.",
    cta: "Start Pro",
    to: "/login" as const,
    highlight: true,
    features: [
      "Unlimited scans",
      "Up to 500 resources / scan",
      "Full ZIP + JSON export",
      "Scrape history & re-runs",
      "AI analysis (summary, SEO, keywords)",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    desc: "For teams and small agencies.",
    cta: "Start Team",
    to: "/login" as const,
    highlight: false,
    features: [
      "Everything in Pro",
      "API access",
      "Scheduled scraping",
      "Team workspace (up to 5 seats)",
      "Priority support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">Pricing</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Simple pricing that scales with you</h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you need scale, history, and AI analysis. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 transition-all ${
                t.highlight
                  ? "border-primary/60 shadow-xl md:-translate-y-2"
                  : "border-border hover:border-primary/30"
              }`}
              style={t.highlight ? { boxShadow: "var(--shadow-glow)" } : undefined}
            >
              {t.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </Badge>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <div className="text-4xl font-bold tracking-tight">{t.price}</div>
                <div className="text-sm text-muted-foreground">{t.period}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={t.highlight ? "default" : "outline"}
                className="mt-8"
              >
                <Link to={t.to}>{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices in USD. Taxes may apply. Need a custom plan?{" "}
          <Link to="/contact" className="underline hover:text-foreground">Contact us</Link>.
        </p>
      </div>
    </section>
  );
}
