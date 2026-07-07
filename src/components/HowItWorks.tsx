import { Link2, Sparkles, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Link2,
    title: "Paste a URL",
    desc: "Drop in any public URL. SiteHarvest fetches the page and every linked resource it can safely reach.",
  },
  {
    icon: Sparkles,
    title: "Scrape & analyze",
    desc: "We extract structured resources — images, scripts, metadata, contacts — and optionally run AI analysis on the content.",
  },
  {
    icon: Download,
    title: "Export & use",
    desc: "Download as ZIP or JSON, sync to your workflow, or dig deeper with re-runs from your history.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/20 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">How it works</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">From URL to structured data in three steps</h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
              <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
