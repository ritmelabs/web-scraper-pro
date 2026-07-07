import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — SiteHarvest Pro" },
      { name: "description", content: "How SiteHarvest Pro collects, uses, and protects your data." },
      { property: "og:title", content: "Privacy Policy — SiteHarvest Pro" },
      { property: "og:description", content: "How SiteHarvest Pro collects, uses, and protects your data." },
      { property: "og:url", content: "https://siteharvestpro.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://siteharvestpro.lovable.app/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Legal</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
          <Note>
            This page is maintained by the SiteHarvest Pro team to answer common privacy questions about the product.
            It is app-owned editable content and not an independent certification. If any statement here conflicts with a
            signed agreement you have with us, that agreement controls.
          </Note>

          <Section title="1. Who we are">
            <p>SiteHarvest Pro (“SiteHarvest”, “we”, “us”) provides a web intelligence and data extraction platform.
              This policy explains what we collect when you use the service and how we handle it.</p>
          </Section>

          <Section title="2. Information we collect">
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Account data</strong> — email and authentication identifiers when you sign in.</li>
              <li><strong>Usage data</strong> — the URLs you submit for scraping, job status, timestamps, and results tied to your account.</li>
              <li><strong>Technical data</strong> — IP address, browser, device, and error logs for security and reliability.</li>
              <li><strong>Payment data</strong> — handled by our payment provider; we store only subscription status and identifiers, never full card details.</li>
            </ul>
          </Section>

          <Section title="3. How we use information">
            <ul className="list-disc space-y-2 pl-5">
              <li>To operate the service (run scrapes, store history, deliver exports).</li>
              <li>To secure the platform, prevent abuse, and enforce our Terms.</li>
              <li>To improve product quality (aggregate, non-identifying analytics).</li>
              <li>To communicate about your account, billing, or service updates.</li>
            </ul>
          </Section>

          <Section title="4. Sharing & subprocessors">
            <p>We do not sell personal data. We share limited data with subprocessors that help us operate — for example
              our hosting provider, database provider, authentication provider, and payment processor. Each subprocessor
              is bound by contractual data protection terms.</p>
          </Section>

          <Section title="5. Data you scrape">
            <p>You are responsible for the URLs you submit. Only scrape content you have the right to access. Respect each
              target site's terms of use and <code>robots.txt</code>. We may block or throttle activity that violates our
              acceptable-use rules.</p>
          </Section>

          <Section title="6. Retention">
            <p>We keep account and job data while your account is active. You can delete your account or specific jobs at
              any time from the app; deletions are permanent within a reasonable operational window.</p>
          </Section>

          <Section title="7. Security">
            <p>We use industry-standard controls: TLS in transit, encrypted storage at rest via our hosting provider,
              role-based database access, and per-user isolation with row-level security. No system is perfectly secure;
              please report suspected issues to the address below.</p>
          </Section>

          <Section title="8. Your rights">
            <p>Depending on your jurisdiction you may have rights to access, correct, export, or delete personal data we
              hold about you. Contact us and we will respond within a reasonable time frame.</p>
          </Section>

          <Section title="9. Changes">
            <p>We may update this policy. Material changes will be announced in the app or via email.</p>
          </Section>

          <Section title="10. Contact">
            <p>Questions? Reach us via the <Link to="/contact" className="text-primary underline">contact page</Link>.</p>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function PageHeader() {
  return (
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
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 text-muted-foreground">{children}</div>
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
      {children}
    </div>
  );
}
