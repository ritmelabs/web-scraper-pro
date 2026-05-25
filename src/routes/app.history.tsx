import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

import { listJobs } from "@/lib/scrape.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/history")({
  component: History,
  head: () => ({ meta: [{ title: "Scrape history — SiteHarvest" }] }),
});

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function History() {
  const fn = useServerFn(listJobs);
  const { data, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: () => fn() });

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">History</h1>
      <p className="mt-2 text-muted-foreground">Your past scrapes.</p>

      <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
        {isLoading && <div className="p-6 text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && (!data || data.length === 0) && (
          <div className="p-8 text-center text-sm text-muted-foreground">No scrapes yet. Start one from the dashboard.</div>
        )}
        {data?.map((j) => (
          <Link key={j.id} to="/app/job/$jobId" params={{ jobId: j.id }} className="flex items-center justify-between gap-4 p-4 hover:bg-accent/40">
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{j.url}</div>
              <div className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(j.created_at), { addSuffix: true })}</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{j.resource_count} files · {fmtSize(j.total_size)}</span>
              <Badge variant={j.status === "completed" ? "default" : j.status === "failed" ? "destructive" : "secondary"}>{j.status}</Badge>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
