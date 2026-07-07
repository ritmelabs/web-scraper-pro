import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <Layers className="h-4 w-4 text-white" />
            </div>
            SiteHarvest
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            AI-powered web intelligence & data extraction platform. Built for teams who need structured, reliable data from the open web.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Only scrape sites you have permission to. Respect each site's terms and robots.txt.
          </p>
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" hash="features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
            <li><Link to="/" hash="pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            <li><Link to="/" hash="how-it-works" className="text-muted-foreground hover:text-foreground">How it works</Link></li>
            <li><Link to="/guest" className="text-muted-foreground hover:text-foreground">Try as guest</Link></li>
            <li><Link to="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company & Legal</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© {year} SiteHarvest · AI Web Intelligence Platform</div>
          <div>Made with care for data teams and researchers.</div>
        </div>
      </div>
    </footer>
  );
}
