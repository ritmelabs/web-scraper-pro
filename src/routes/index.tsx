import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Globe, Layers, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "SiteHarvest — Download every resource from any website" },
      { name: "description", content: "Scrape and download all assets from any website as a ZIP. Free with Google sign-in." },
    ],
  }),
});

function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Layers className="h-5 w-5 text-primary" />
            SiteHarvest
          </div>
          <Button asChild size="sm">
            <Link to={user ? "/app" : "/login"}>{user ? "Open app" : "Sign in"}</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" /> Universal website resource scraper
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl">
            Download <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>every asset</span><br />
            from any website
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Paste a URL. We extract HTML, CSS, JS, images, fonts, videos, documents and more — then hand you a clean ZIP.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-lg" style={{ boxShadow: "var(--shadow-glow)" }}>
              <Link to={user ? "/app" : "/login"}>
                <Download className="mr-2 h-4 w-4" /> Start scraping
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-24 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { icon: Globe, title: "Works on any site", desc: "Static pages, SPAs, blogs, landing pages — point and shoot." },
            { icon: Layers, title: "Every resource type", desc: "Images, fonts, scripts, stylesheets, videos, docs, manifests." },
            { icon: ShieldCheck, title: "Private by default", desc: "Sign in with Google. Your scrape history stays yours." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 text-left">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-muted-foreground">
          Only scrape sites you have permission to. Respect each site's terms and robots.txt.
        </p>
      </section>
    </div>
  );
}
