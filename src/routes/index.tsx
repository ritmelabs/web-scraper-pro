import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Sparkles, Globe, Brain, Activity, Download, Database,
  Layers, Shield, Lock, CheckCircle2, Search, FileJson, Mail, Image as ImageIcon,
  Zap, BarChart3, Code2, PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Testimonials } from "@/components/Testimonials";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { SiteFooter } from "@/components/SiteFooter";

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
    items: ["AI Summarizer", "Keyword Analysis", "SEO Analyzer", "Content Classification", "Sentiment Analysis", "Smart Categorization", "Duplicate Detector"],
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
    icon: Database, name: "Data Intelligence", desc: "Turn pages into datasets", color: "from-rose-500/20 to-red-500/20", soon: true,
    items: ["Dataset Cleaner", "Smart Search", "Auto-Tagging", "Cross-Site Compare", "Executive Briefs"],
  },
];

const trust = [
  { icon: Shield, label: "Secure & Encrypted" },
  { icon: Lock, label: "Privacy-First" },
  { icon: CheckCircle2, label: "Respects robots.txt" },
  { icon: Zap, label: "Rate-limit Safe" },
];

const heroStats = [
  { icon: FileJson, label: "Structured Data", value: 247 },
  { icon: ImageIcon, label: "Images & Media", value: 89 },
  { icon: Mail, label: "Contacts Found", value: 12 },
  { icon: Code2, label: "Scripts & Styles", value: 156 },
];

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

function StatCard({ s, active }: { s: (typeof heroStats)[number]; active: boolean }) {
  const n = useCountUp(s.value, active);
  return (
    <div className="rounded-lg border border-border bg-background p-4 text-left">
      <s.icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-2xl font-bold tabular-nums">{n}</div>
      <div className="text-xs text-muted-foreground">{s.label}</div>
    </div>
  );
}

function ProductMockup() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(true),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto mt-16 max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400/70" />
          <div className="h-3 w-3 rounded-full bg-amber-400/70" />
          <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <div className="ml-4 flex h-6 flex-1 items-center rounded-md bg-background/60 px-3 text-xs text-muted-foreground">
            <Search className="mr-2 h-3 w-3" /> https://stripe.com
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
          {heroStats.map((s) => <StatCard key={s.label} s={s} active={active} />)}
        </div>
        <div className="border-t border-border px-6 py-4">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="font-medium text-foreground">Recent resources</div>
            <div>Live sample</div>
          </div>
          <div className="space-y-2">
            {[
              { type: "IMG", url: "/assets/hero.png", size: "184 KB" },
              { type: "JS", url: "/js/checkout.min.js", size: "42 KB" },
              { type: "CSS", url: "/css/app.a13b.css", size: "88 KB" },
              { type: "META", url: "og:image · twitter:card · canonical", size: "—" },
            ].map((r) => (
              <div key={r.url} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/50 px-3 py-2 text-xs">
                <span className="min-w-[42px] rounded bg-primary/10 px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold text-primary">{r.type}</span>
                <span className="flex-1 truncate font-mono text-muted-foreground">{r.url}</span>
                <span className="text-muted-foreground">{r.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Sample output from a recent scan</p>
    </div>
  );
}

function Header() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-40 border-b transition-all ${scrolled ? "border-border bg-background/85 backdrop-blur-xl shadow-sm" : "border-transparent bg-background/40 backdrop-blur"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundImage: "var(--gradient-hero)" }}>
            <Layers className="h-4 w-4 text-white" />
          </div>
          SiteHarvest
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#trust" className="hover:text-foreground">Security</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">{user ? "Open app" : "Sign in"}</Link></Button>
          <Button asChild size="sm"><Link to={user ? "/app" : "/guest"}>Start free <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
        </div>
      </div>
    </header>
  );
}

function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Header />

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
            <span className="animated-gradient-text bg-clip-text text-transparent">Web Data Professionally</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AI-powered website scraping, structured extraction, analytics, monitoring, and intelligent workflows — in one premium platform.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 shadow-xl" style={{ boxShadow: "var(--shadow-glow)" }}>
              <Link to={user ? "/app" : "/guest"}>Start Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <a href="#how-it-works"><PlayCircle className="mr-1 h-4 w-4" /> See how it works</a>
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 2 free scans</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 500 resources / scan</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> ZIP + JSON export</span>
          </div>

          <ProductMockup />
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

      {/* How it works */}
      <HowItWorks />

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
                  {c.soon && <Badge variant="secondary" className="text-[10px]">Coming soon</Badge>}
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

      {/* Pricing */}
      <Pricing />

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

      <SiteFooter />
    </div>
  );
}
