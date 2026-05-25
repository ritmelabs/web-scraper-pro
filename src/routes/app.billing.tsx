import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/tier";
import { getMyTier } from "@/lib/scrape.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  component: Billing,
  head: () => ({ meta: [{ title: "Billing & plans — SiteHarvest" }] }),
});

function Billing() {
  const fn = useServerFn(getMyTier);
  const { data } = useQuery({ queryKey: ["my-tier"], queryFn: () => fn() });
  const currentTier = data?.tier ?? "free";

  const handleUpgrade = (tier: string) => {
    if (tier === "enterprise") {
      window.location.href = "mailto:sales@siteharvest.app?subject=Enterprise%20inquiry";
      return;
    }
    toast.info("Checkout coming soon — billing is being finalized. Contact support to be notified.");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plans & billing</h1>
        <p className="mt-2 text-muted-foreground">
          Current plan: <Badge variant={currentTier === "free" ? "secondary" : "default"} className="ml-1">{currentTier}</Badge>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          return (
            <Card
              key={plan.tier}
              className={`relative flex flex-col p-6 ${plan.highlight ? "border-primary/60 shadow-lg shadow-primary/10" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="mr-1 inline h-3 w-3" />Most popular
                </div>
              )}
              <div className="font-semibold">{plan.name}</div>
              <div className="mt-3">
                <span className="text-4xl font-bold">{plan.priceLabel}</span>
                <span className="ml-1 text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.highlight ? "default" : "outline"}
                disabled={isCurrent}
                onClick={() => handleUpgrade(plan.tier)}
              >
                {isCurrent ? "Current plan" : plan.cta}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Billing setup</p>
        <p className="mt-1">Stripe checkout integration is being finalized. Once enabled you'll be able to subscribe with one click and manage your plan from this page.</p>
      </Card>
    </div>
  );
}
