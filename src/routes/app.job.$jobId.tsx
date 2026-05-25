import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Download, ExternalLink, Loader2, Package } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getJob } from "@/lib/scrape.functions";

export const Route = createFileRoute("/app/job/$jobId")({
  component: JobView,
  head: () => ({ meta: [{ title: "Scrape results — SiteHarvest" }] }),
});

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

const TYPES = ["all", "html", "css", "js", "image", "font", "video", "audio", "document", "manifest", "favicon", "other"];

function JobView() {
  const { jobId } = Route.useParams();
  const fn = useServerFn(getJob);
  const { data, isLoading } = useQuery({ queryKey: ["job", jobId], queryFn: () => fn({ data: { jobId } }) });

  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [zipping, setZipping] = useState(false);

  const filtered = useMemo(() => {
    return (data?.resources ?? []).filter((r) =>
      (filter === "all" || r.type === filter) &&
      (q === "" || r.filename.toLowerCase().includes(q.toLowerCase()) || r.source_url.toLowerCase().includes(q.toLowerCase()))
    );
  }, [data, filter, q]);

  const downloadAll = async () => {
    if (!data?.resources?.length) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const host = (() => { try { return new URL(data.job!.url).hostname; } catch { return "site"; } })();
      const root = zip.folder(host)!;
      const inventory: Array<{ filename: string; type: string; size: number; url: string }> = [];
      let done = 0;
      for (const r of data.resources) {
        try {
          const res = await fetch(r.source_url);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            const folder = root.folder(r.type)!;
            let name = r.filename;
            let i = 1;
            while (folder.file(name)) name = `${i++}-${r.filename}`;
            folder.file(name, buf);
            inventory.push({ filename: `${r.type}/${name}`, type: r.type, size: buf.byteLength, url: r.source_url });
          }
        } catch { /* skip */ }
        done++;
        if (done % 10 === 0) toast.info(`Packaged ${done}/${data.resources.length}`);
      }
      root.file("manifest.json", JSON.stringify({ source: data.job!.url, scraped_at: data.job!.created_at, files: inventory }, null, 2));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${host}-resources.zip`;
      a.click();
      toast.success("ZIP ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ZIP failed");
    } finally {
      setZipping(false);
    }
  };

  if (isLoading) return <div className="mx-auto max-w-6xl"><div className="text-muted-foreground">Loading…</div></div>;
  if (!data?.job) return <div className="mx-auto max-w-6xl"><div className="text-muted-foreground">Job not found</div></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge variant={data.job.status === "completed" ? "default" : data.job.status === "failed" ? "destructive" : "secondary"}>{data.job.status}</Badge>
          <h1 className="mt-2 truncate text-2xl font-bold">{data.job.url}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.job.resource_count} resources · {fmtSize(data.job.total_size)}
          </p>
          {data.job.error && <p className="mt-2 text-sm text-destructive">{data.job.error}</p>}
        </div>
        <Button onClick={downloadAll} disabled={zipping || !data.resources.length} size="lg">
          {zipping ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Packaging…</> : <><Package className="mr-2 h-4 w-4" />Download all as ZIP</>}
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Input placeholder="Filter by name or URL…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <div className="flex flex-wrap gap-1">
          {TYPES.map((t) => (
            <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)}>{t}</Button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">File</th>
              <th className="p-3 text-right">Size</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3"><Badge variant="secondary">{r.type}</Badge></td>
                <td className="p-3">
                  <div className="font-medium">{r.filename}</div>
                  <div className="truncate text-xs text-muted-foreground" style={{ maxWidth: 480 }}>{r.source_url}</div>
                </td>
                <td className="p-3 text-right tabular-nums text-muted-foreground">{fmtSize(r.size)}</td>
                <td className="p-3 text-right">
                  <a href={r.source_url} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center gap-1 text-primary hover:underline">
                    <Download className="h-3 w-3" /> <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No resources match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
