import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, History, Sparkles, Zap, TrendingUp, FileStack, Calendar, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDashboardStats } from "@/lib/scrape.functions";
import { TIER_LIMITS } from "@/lib/tier";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — SiteHarvest" }] }),
});

function Dashboard() {
  const fn = useServerFn(getDashboardStats);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => fn() });

  if (isLoading || !data) {
    return <div className="text-muted-foreground">Loading dashboard…</div>;
  }

  const limits = TIER_LIMITS[data.tier];
  const pct = Math.min(100, Math.round((data.todayCount / limits.dailyScrapes) * 100));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            <Badge variant={data.tier === "free" ? "secondary" : "default"} className="mr-2">{limits.label} plan</Badge>
            Welcome back. Here's your activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/app/history"><History className="mr-2 h-4 w-4" />History</Link></Button>
          <Button asChild><Link to="/app/scrape"><Download className="mr-2 h-4 w-4" />New scrape</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Today" value={data.todayCount} sub={`of ${limits.dailyScrapes} daily`} />
        <StatCard icon={TrendingUp} label="This month" value={data.monthCount} sub="scrapes" />
        <StatCard icon={FileStack} label="Resources" value={data.totalResources} sub="captured" />
        <StatCard icon={Brain} label="AI analyses" value={data.aiAnalyses} sub={limits.aiEnabled ? "unlimited" : "1 free trial"} />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Daily quota</h2>
            <p className="text-sm text-muted-foreground">{data.todayCount} / {limits.dailyScrapes} scrapes used today</p>
          </div>
          {data.tier === "free" && (
            <Button asChild size="sm" variant="outline"><Link to="/app/billing"><Zap className="mr-1 h-3 w-3" />Upgrade</Link></Button>
          )}
        </div>
        <Progress value={pct} className="mt-4" />
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold">Recent scrapes</h2>
          <div className="mt-4 divide-y divide-border">
            {data.recent.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No scrapes yet. <Link to="/app/scrape" className="text-primary hover:underline">Start your first one.</Link></p>}
            {data.recent.map((j) => (
              <Link key={j.id} to="/app/job/$jobId" params={{ jobId: j.id }} className="flex items-center justify-between gap-3 py-3 hover:bg-accent/40">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{j.url}</div>
                  <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(j.created_at), { addSuffix: true })}</div>
                </div>
                <Badge variant={j.status === "completed" ? "default" : j.status === "failed" ? "destructive" : "secondary"}>{j.status}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-semibold">AI Studio</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn raw scrapes into intelligence: AI summaries, SEO audits, keyword extraction, tech-stack detection.
          </p>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            <li>• Summary & purpose detection</li>
            <li>• SEO health score (0-100)</li>
            <li>• Keyword & entity extraction</li>
            <li>• Tech stack inference</li>
          </ul>
          <Button asChild size="sm" className="mt-4 w-full">
            <Link to="/app/scrape">Try AI Studio</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; sub: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </Card>
  );
}
