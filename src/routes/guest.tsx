import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, Loader2, Layers, FileText, Image, Code, Type, Film, FileCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { scrapePublic } from "@/lib/scrape.functions";
import { GUEST_LIMIT, getGuestCount, guestRemaining, incrementGuestCount } from "@/lib/guest";
import { ConversionModal } from "@/components/ConversionModal";

export const Route = createFileRoute("/guest")({
  component: Guest,
  head: () => ({ meta: [{ title: "Try it free — SiteHarvest" }] }),
});

type Resource = { type: string; filename: string; source_url: string; size: number; content_type: string | null };

const typeIcon: Record<string, typeof FileText> = {
  html: FileCode, css: Code, js: Code, image: Image, font: Type, video: Film, document: FileText,
};

function Guest() {
  const scrape = useServerFn(scrapePublic);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Resource[] | null>(null);
  const [remaining, setRemaining] = useState(GUEST_LIMIT);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setRemaining(guestRemaining()); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (getGuestCount() >= GUEST_LIMIT) { setShowModal(true); return; }
    setBusy(true);
    try {
      const res = await scrape({ data: { url } });
      setResults(res.resources as Resource[]);
      const used = incrementGuestCount();
      setRemaining(Math.max(0, GUEST_LIMIT - used));
      toast.success(`Found ${res.resources.length} resources (preview)`);
      if (used >= GUEST_LIMIT) setTimeout(() => setShowModal(true), 800);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Scrape failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold"><Layers className="h-5 w-5 text-primary" /> SiteHarvest</Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline-flex">Guest mode · {remaining}/{GUEST_LIMIT} free scans left</Badge>
            <Button asChild size="sm" variant="outline"><Link to="/login">Sign in</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12">
        <div className="text-center">
          <Badge className="mb-3"><Sparkles className="mr-1 h-3 w-3" /> Free preview</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Try web extraction instantly</h1>
          <p className="mt-2 text-muted-foreground">No login required. {remaining} of {GUEST_LIMIT} free scans remaining.</p>
        </div>

        <form onSubmit={submit} className="mt-8 flex gap-2">
          <Input type="url" required placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="h-12 text-base" disabled={busy || remaining === 0} />
          <Button type="submit" size="lg" disabled={busy || remaining === 0} className="h-12">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scraping…</> : <><Download className="mr-2 h-4 w-4" /> Scrape</>}
          </Button>
        </form>

        {remaining === 0 && !results && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-center text-sm">
            You've used your free scans. <button onClick={() => setShowModal(true)} className="font-medium text-primary underline">Create a free account</button> to continue.
          </div>
        )}

        {results && (
          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{results.length} resources extracted</h2>
              <Badge variant="outline">Preview · watermarked</Badge>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr><th className="px-4 py-2 text-left">Type</th><th className="px-4 py-2 text-left">Filename</th><th className="px-4 py-2 text-right">Size</th></tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const Icon = typeIcon[r.type] || FileText;
                    return (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-2"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" /><span className="capitalize">{r.type}</span></div></td>
                        <td className="truncate px-4 py-2 font-mono text-xs">{r.filename}</td>
                        <td className="px-4 py-2 text-right text-muted-foreground">{(r.size / 1024).toFixed(1)} KB</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-lg border border-dashed border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">Want to download these as a ZIP, save them to your library, and run AI analysis?</p>
              <Button onClick={() => setShowModal(true)} className="mt-3">Create free account</Button>
            </div>
          </div>
        )}
      </main>
      <ConversionModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
