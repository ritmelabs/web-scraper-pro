import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Globe, Brain, Activity, Download, Database,
  Layers, Shield, Lock, CheckCircle2, Search, FileJson, Mail, Image as ImageIcon,
  Zap, BarChart3, Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Testimonials } from "@/components/Testimonials";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SiteHarvest Pro — AI-Powered Web Intelligence & Data Extraction" },
      { name: "description", content: "Extract, analyze and organize web data professionally. AI-powered scraping, structured extraction, analytics and monitoring in one premium platform." },
      { property: "og:title", content: "SiteHarvest Pro — AI Web Intelligence Platform" },
      { property: "og:description", content: "The professional platform for web data extraction, analysis and intelligence." },
      { property: "og:url", content: "https://siteharvestpro.lovable.app/" },
      { name: "twitter:title", content: "SiteHarvest Pro — AI Web Intelligence Platform" },
      { name: "twitter:description", content: "Extract, analyze and organize web data professionally." },
    ],
    links: [{ rel: "canonical", href: "https://siteharvestpro.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "SiteHarvest Pro",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: "AI-powered web intelligence and data extraction platform.",
          url: "https://siteharvestpro.lovable.app/",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
});

const categories = [
  {
    icon: Globe, name: "Web Scraping", desc: "Extract any site at scale", color: "from-blue-500/20 to-cyan-500/20",
    items: ["Website Scraper", "URL Extractor", "Bulk URL Scraper", "Deep Crawl", "Sitemap Scanner", "Metadata Extractor", "Contact & Email Finder", "Structured Data Parser", "Article & Product Extractor", "Image & Media"],
  },
  {
    icon: Brain, name: "AI Analysis", desc: "Understand what you collect", color: "from-purple-500/20 to-pink-500/20",
    items: ["AI Summarizer", "Keyword Analysis", "SEO Analyzer", "Content Classification", "Sentiment Analysis", "Trend Detection", "Competitor Analysis", "Smart Categorization", "Duplicate Detector"],
  },
  {
    icon: Activity, name: "Monitoring", desc: "Track changes automatically", color: "from-amber-500/20 to-orange-500/20", soon: true,
    items: ["Website Change Monitor", "Competitor Tracker", "Trend Monitoring", "Content Updates", "Broken Link Monitor", "Metadata Change Detection"],
  },
  {
    icon: Download, name: "Export & Workflow", desc: "Ship data anywhere", color: "from-emerald-500/20 to-teal-500/20",
    items: ["CSV / JSON / Excel / PDF Export", "Google Sheets Sync", "Notion Sync", "API Access", "Scheduled Scraping", "Workflow Builder"],
  },
  {
    icon: Database, name: "Data Intelligence", desc: "Turn pages into datasets", color: "from-rose-500/20 to-red-500/20",
    items: ["Dataset Cleaner", "Smart Search", "Auto-Tagging", "Cross-Site Compare", "Executive Briefs"],
  },
];

const trust = [
  { icon: Shield, label: "Secure & Encrypted" },
  { icon: Lock, label: "Privacy-First" },
  { icon: CheckCircle2, label: "Respects robots.txt" },
  { icon: Zap, label: "Rate-limit Safe" },
];

function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <Layers className="h-4 w-4 text-white" />
            </div>
            SiteHarvest
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#categories" className="hover:text-foreground">Platform</a>
            <a href="#trust" className="hover:text-foreground">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/login">{user ? "Open app" : "Sign in"}</Link></Button>
            <Button asChild size="sm"><Link to={user ? "/app" : "/guest"}>Start free <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ backgroundImage: "var(--gradient-hero)" }} />
        </div>
        <div className="container mx-auto px-4 py-24 text-center md:py-32">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" /> AI-Powered Web Intelligence Platform
          </Badge>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Extract, Analyze & Organize <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>Web Data Professionally</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered website scraping, structured extraction, analytics, monitoring, and intelligent workflows — in one premium platform.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 shadow-xl" style={{ boxShadow: "var(--shadow-glow)" }}>
              <Link to={user ? "/app" : "/guest"}>Start Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <Link to="/guest">Try Demo</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 px-6">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card · 2 free scans as guest</p>

          {/* Product preview mock */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400/70" />
                <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                <div className="ml-4 flex h-6 flex-1 items-center rounded-md bg-background/60 px-3 text-xs text-muted-foreground">
                  <Search className="mr-2 h-3 w-3" /> https://stripe.com
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
                {[
                  { icon: FileJson, label: "Structured Data", value: "247" },
                  { icon: ImageIcon, label: "Images & Media", value: "89" },
                  { icon: Mail, label: "Contacts Found", value: "12" },
                  { icon: Code2, label: "Scripts & Styles", value: "156" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-background p-4 text-left">
                    <s.icon className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="border-t border-border bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Why SiteHarvest</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Built for professionals who need real data</h2>
            <p className="mt-3 text-muted-foreground">Not a toy. A complete intelligence stack from extraction to insight.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Quick or Deep Scrape", desc: "From a single URL to recursive site crawls, with AI-aware structure detection." },
              { icon: Brain, title: "AI-Native Analysis", desc: "Summarize, classify, extract entities, and detect trends across collected pages." },
              { icon: BarChart3, title: "Organized Workspaces", desc: "Projects, saved datasets and history — your intelligence stays structured." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><f.icon className="h-5 w-5 text-primary" /></div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">The Platform</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">One platform. Every web intelligence workflow.</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c.name} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-xl">
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${c.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10"><c.icon className="h-5 w-5 text-primary" /></div>
                  {c.soon && <Badge variant="secondary" className="text-[10px]">Soon</Badge>}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {c.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="border-t border-border bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Built on trust</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Enterprise-grade by default</h2>
            <p className="mt-3 text-muted-foreground">Secure infrastructure, transparent logs, and respect for the open web.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 md:grid-cols-4">
            {trust.map((t) => (
              <div key={t.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <t.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">Start extracting in 60 seconds</h2>
            <p className="mt-3 text-muted-foreground">Try it free as a guest — no signup required for your first 2 scans.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-6"><Link to="/guest">Try Free <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6"><Link to="/login">Create account</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} SiteHarvest · AI Web Intelligence Platform</div>
          <div>Only scrape sites you have permission to. Respect each site's terms and robots.txt.</div>
        </div>
      </footer>
    </div>
  );
}
