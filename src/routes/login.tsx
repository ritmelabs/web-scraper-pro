import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — SiteHarvest" }] }),
});

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/app" });
  }, [user, loading, navigate]);

  const signIn = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (result.error) {
      toast.error(result.error.message || "Sign-in failed");
      setBusy(false);
      return;
    }
    if (!result.redirected) navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Layers className="h-5 w-5 text-primary" /> SiteHarvest
        </div>
        <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in with Google to start scraping websites.</p>
        <Button onClick={signIn} disabled={busy} size="lg" className="mt-6 w-full">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.72 1.43l2.54-2.45C16.84 3.7 14.74 2.8 12.18 2.8 6.93 2.8 2.7 7.03 2.7 12.26s4.23 9.46 9.48 9.46c5.47 0 9.1-3.85 9.1-9.27 0-.62-.07-1.1-.17-1.55z"/></svg>
          {busy ? "Connecting..." : "Continue with Google"}
        </Button>
        <p className="mt-6 text-center text-xs text-muted-foreground">By signing in you agree to scrape responsibly.</p>
      </div>
    </div>
  );
}
