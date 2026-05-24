import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Layers, History, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/app" className="flex items-center gap-2 font-bold">
            <Layers className="h-5 w-5 text-primary" /> SiteHarvest
          </Link>
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm"><Link to="/app"><Home className="mr-1 h-4 w-4" />New scrape</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link to="/app/history"><History className="mr-1 h-4 w-4" />History</Link></Button>
            <div className="mx-2 hidden text-xs text-muted-foreground md:block">{user.email}</div>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
