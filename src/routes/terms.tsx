import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — SiteHarvest Pro" },
      { name: "description", content: "The terms that govern your use of SiteHarvest Pro." },
      { property: "og:title", content: "Terms of Service — SiteHarvest Pro" },
      { property: "og:description", content: "The terms that govern your use of SiteHarvest Pro." },
      { property: "og:url", content: "https://siteharvestpro.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://siteharvestpro.lovable.app/terms" }],
  }),
});

function TermsPage() {
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

      <main className="container mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Legal</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            This page is app-owned editable content. It is a starting template — replace with terms reviewed by your legal
            counsel before relying on it for a paid launch.
          </div>

          <S title="1. Agreement">
            By accessing or using SiteHarvest Pro (the “Service”) you agree to these Terms. If you do not agree, do not use the Service.
          </S>

          <S title="2. The Service">
            SiteHarvest provides tools for extracting, analyzing, and organizing publicly available web content. The Service is
            offered on a free tier and paid subscription plans. We may change or discontinue features with reasonable notice.
          </S>

          <S title="3. Acceptable use">
            <ul className="list-disc space-y-2 pl-5">
              <li>Only scrape content you have the right to access.</li>
              <li>Respect each target site's Terms and <code>robots.txt</code>.</li>
              <li>No excessive load, no bypassing paywalls, no illegal content.</li>
              <li>No scraping of personal data in violation of applicable law.</li>
            </ul>
            <p className="mt-3">We may suspend or terminate accounts that violate these rules.</p>
          </S>

          <S title="4. Accounts">
            You are responsible for the security of your credentials and for all activity under your account.
          </S>

          <S title="5. Subscriptions & billing">
            Paid plans renew automatically until cancelled. You can cancel from your account at any time; cancellations take
            effect at the end of the current billing period. Fees already paid are non-refundable except where required by law.
          </S>

          <S title="6. Intellectual property">
            The Service, including its software and branding, is owned by SiteHarvest and its licensors. You retain ownership
            of the data you legally extract using the Service.
          </S>

          <S title="7. Disclaimer">
            The Service is provided “as is” without warranties of any kind. We do not guarantee that every scrape will succeed
            or that any data will be complete, accurate, or usable for your purpose.
          </S>

          <S title="8. Limitation of liability">
            To the maximum extent permitted by law, SiteHarvest is not liable for indirect, incidental, or consequential damages,
            or for lost profits or data, arising from your use of the Service.
          </S>

          <S title="9. Changes">
            We may update these Terms. Continued use after changes take effect constitutes acceptance.
          </S>

          <S title="10. Contact">
            Reach us via the <Link to="/contact" className="text-primary underline">contact page</Link>.
          </S>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 text-muted-foreground">{children}</div>
    </section>
  );
}
