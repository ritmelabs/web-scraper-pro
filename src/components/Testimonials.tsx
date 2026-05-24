import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reviews = [
  {
    name: "Sarah Chen",
    role: "Growth Lead · Notion",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    text: "SiteHarvest replaced three internal scripts and an outsourced scraping vendor. The AI summaries alone saved my team ~12 hours a week.",
  },
  {
    name: "Marcus Wright",
    role: "Founder · Lumen Analytics",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    text: "I've tried every scraper on the market. This is the first one that feels like a real product — clean UI, structured exports, no flaky crawls.",
  },
  {
    name: "Aisha Patel",
    role: "SEO Director · Shopify Plus agency",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    text: "We use SiteHarvest weekly for competitor audits. The metadata extractor + AI keyword analysis combo is genuinely best-in-class.",
  },
  {
    name: "Daniel Okafor",
    role: "Data Engineer · Stripe",
    avatar: "https://i.pravatar.cc/120?img=68",
    rating: 5,
    text: "Bulk URL scraping that just works. Clean JSON output, predictable schema, and the deep-crawl mode respects rate limits out of the box.",
  },
  {
    name: "Elena Rossi",
    role: "Researcher · MIT Media Lab",
    avatar: "https://i.pravatar.cc/120?img=45",
    rating: 5,
    text: "For academic research where reproducibility matters, the structured exports and per-job history have been invaluable.",
  },
  {
    name: "Tomás Herrera",
    role: "PM · Linear",
    avatar: "https://i.pravatar.cc/120?img=8",
    rating: 5,
    text: "The guest mode let me prove value to my team in 60 seconds. Two scans later we'd already upgraded the whole org.",
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
          <Badge variant="outline" className="mb-3">Loved by 12,000+ professionals</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Teams ship faster with SiteHarvest</h2>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-sm font-medium text-muted-foreground">4.9 · 1,847 reviews</span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/30" />
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{r.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                />
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
