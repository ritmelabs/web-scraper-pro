import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/AppShell";
import { startScrape } from "@/lib/scrape.functions";

export const Route = createFileRoute("/app/")({
  component: AppHome,
  head: () => ({ meta: [{ title: "Scrape a website — SiteHarvest" }] }),
});

function AppHome() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const scrape = useServerFn(startScrape);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setBusy(true);
    try {
      const res = await scrape({ data: { url } });
      toast.success(`Found ${res.count} resources`);
      navigate({ to: "/app/job/$jobId", params: { jobId: res.jobId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Scrape failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Scrape a website</h1>
        <p className="mt-2 text-muted-foreground">Paste any URL. We'll pull every resource we can find.</p>

        <form onSubmit={submit} className="mt-8 flex gap-2">
          <Input
            type="url" required placeholder="https://example.com"
            value={url} onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base"
          />
          <Button type="submit" size="lg" disabled={busy} className="h-12">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scraping…</> : <><Download className="mr-2 h-4 w-4" />Scrape</>}
          </Button>
        </form>

        <div className="mt-12 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">What gets collected</p>
          <p className="mt-2">HTML, CSS, JavaScript, images, fonts, videos, audio, documents, manifests, favicons, and more — up to 500 resources per scrape.</p>
        </div>
      </div>
    </AppShell>
  );
}
