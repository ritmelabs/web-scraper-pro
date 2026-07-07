import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reviews = [
  {
    name: "Early access user",
    role: "Growth & data workflows",
    initials: "EA",
    color: "from-indigo-500 to-blue-500",
    text: "Join early users building repeatable data workflows with SiteHarvest — from competitor tracking to structured content audits.",
  },
  {
    name: "Beta tester",
    role: "SEO & research",
    initials: "BT",
    color: "from-emerald-500 to-teal-500",
    text: "The metadata extractor and structured export are exactly what a small research team needs — clean JSON, no flaky crawls.",
  },
  {
    name: "Product feedback",
    role: "Founding cohort",
    initials: "PF",
    color: "from-amber-500 to-rose-500",
    text: "Guest mode is a great way to try it in 60 seconds before deciding whether it fits your workflow.",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full blur-3xl" style={{ backgroundImage: "var(--gradient-hero)" }} />
      </div>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">Early access</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Built with early users, in the open</h2>
          <p className="mt-3 text-muted-foreground">
            SiteHarvest is a young product. Feedback from our first cohort shapes every release.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/30" />
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${r.color} text-xs font-semibold text-white`}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
