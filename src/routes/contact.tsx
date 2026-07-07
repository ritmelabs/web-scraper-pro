import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ArrowLeft, Mail, MessageSquare, Shield, LifeBuoy } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — SiteHarvest Pro" },
      { name: "description", content: "Get in touch with the SiteHarvest Pro team about sales, support, security, or partnerships." },
      { property: "og:title", content: "Contact — SiteHarvest Pro" },
      { property: "og:description", content: "Get in touch with the SiteHarvest Pro team." },
      { property: "og:url", content: "https://siteharvestpro.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://siteharvestpro.lovable.app/contact" }],
  }),
});

const channels = [
  { icon: LifeBuoy, title: "Product support", desc: "Questions about scraping, exports, or your account.", email: "support@siteharvestpro.app" },
  { icon: MessageSquare, title: "Sales & enterprise", desc: "Custom plans, higher limits, or team onboarding.", email: "sales@siteharvestpro.app" },
  { icon: Shield, title: "Security & privacy", desc: "Report a vulnerability or ask a privacy question.", email: "security@siteharvestpro.app" },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <Layers className="h-4 w-4 text-white" />
            </div>
            SiteHarvest
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-20">
        <div className="text-center">
          <Badge variant="outline" className="mb-3">Contact</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We answer most emails within one business day. Pick the channel that best fits your question.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.title}
              href={`mailto:${c.email}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary group-hover:underline">
                <Mail className="h-4 w-4" /> {c.email}
              </div>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          Prefer async? Open the app and use the in-product feedback link — every message routes to the founding team.
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
