import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { startScrape } from "@/lib/scrape.functions";
import { HowItWorks } from "@/components/HowItWorks";

export const Route = createFileRoute("/app/scrape")({
  component: ScrapePage,
  head: () => ({ meta: [{ title: "New scrape — SiteHarvest" }] }),
});

function ScrapePage() {
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
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New scrape</h1>
        <p className="mt-2 text-muted-foreground">Paste any URL. We'll pull every resource we can find — then run AI analysis on demand.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="flex gap-2">
          <Input
            type="url" required placeholder="https://example.com"
            value={url} onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base"
          />
          <Button type="submit" size="lg" disabled={busy} className="h-12">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Scraping…</> : <><Download className="mr-2 h-4 w-4" />Scrape</>}
          </Button>
        </form>
      </Card>

      <HowItWorks />
    </div>
  );
}
