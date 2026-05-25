import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2, FileText, Search, Tag, Layers, Cpu, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { runAnalysis, listAnalyses } from "@/lib/ai.functions";
import { getJob } from "@/lib/scrape.functions";

export const Route = createFileRoute("/app/ai/$jobId")({
  component: AIStudio,
  head: () => ({ meta: [{ title: "AI Studio — SiteHarvest" }] }),
});

const KINDS = [
  { type: "summary", icon: FileText, label: "Summary", desc: "Purpose, audience, headline" },
  { type: "seo", icon: Search, label: "SEO audit", desc: "Title, meta, headings, score" },
  { type: "keywords", icon: Tag, label: "Keywords", desc: "Primary, secondary, entities" },
  { type: "categorization", icon: Layers, label: "Categorization", desc: "Industry, niche, tone" },
  { type: "tech_stack", icon: Cpu, label: "Tech stack", desc: "Frameworks, libraries, CMS" },
] as const;

function AIStudio() {
  const { jobId } = Route.useParams();
  const qc = useQueryClient();
  const jobFn = useServerFn(getJob);
  const listFn = useServerFn(listAnalyses);
  const runFn = useServerFn(runAnalysis);

  const { data: jobData } = useQuery({ queryKey: ["job", jobId], queryFn: () => jobFn({ data: { jobId } }) });
  const { data: analyses } = useQuery({ queryKey: ["analyses", jobId], queryFn: () => listFn({ data: { jobId } }) });

  const run = useMutation({
    mutationFn: (type: string) => runFn({ data: { jobId, type: type as "summary" } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analyses", jobId] });
      toast.success("Analysis ready");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Analysis failed"),
  });

  const findAnalysis = (type: string) => analyses?.find((a) => a.type === type);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" size="sm"><Link to="/app/job/$jobId" params={{ jobId }}><ArrowLeft className="mr-1 h-4 w-4" />Back to results</Link></Button>

      <div>
        <Badge variant="secondary"><Sparkles className="mr-1 h-3 w-3" />AI Studio</Badge>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">AI analysis</h1>
        {jobData?.job && <p className="mt-1 truncate text-sm text-muted-foreground">{jobData.job.url}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {KINDS.map(({ type, icon: Icon, label, desc }) => {
          const result = findAnalysis(type);
          const isRunning = run.isPending && run.variables === type;
          return (
            <Card key={type} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-primary" />{label}</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
                <Button size="sm" variant={result ? "outline" : "default"} disabled={isRunning} onClick={() => run.mutate(type)}>
                  {isRunning ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Running…</> : result ? "Re-run" : "Run"}
                </Button>
              </div>
              {result && (
                <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs">{JSON.stringify(result.result, null, 2)}</pre>
              )}
              {!result && !isRunning && (
                <div className="mt-4 rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">No analysis yet.</div>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="p-4 text-xs text-muted-foreground">
        Free plan includes 1 lifetime AI analysis. Upgrade to <Link to="/app/billing" className="text-primary hover:underline">Pro</Link> for unlimited AI Studio access.
      </Card>
    </div>
  );
}
