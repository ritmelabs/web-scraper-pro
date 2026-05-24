import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layers, Mail, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — SiteHarvest" }] }),
});

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choose" | "email">("choose");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate({ to: "/app" }); }, [user, loading, navigate]);

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (result.error) { toast.error(result.error.message || "Sign-in failed"); setBusy(false); return; }
    if (!result.redirected) navigate({ to: "/app" });
  };

  const emailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/app" } });
        if (error) throw error;
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/app" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="flex items-center gap-2 font-bold"><Layers className="h-5 w-5 text-primary" /> SiteHarvest</div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            {mode === "email" ? (isSignUp ? "Create your account" : "Welcome back") : "Get started"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "email" ? "Use your email and password." : "Choose how you want to continue."}
          </p>

          {mode === "choose" ? (
            <div className="mt-6 space-y-2">
              <Button onClick={google} disabled={busy} size="lg" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.72 1.43l2.54-2.45C16.84 3.7 14.74 2.8 12.18 2.8 6.93 2.8 2.7 7.03 2.7 12.26s4.23 9.46 9.48 9.46c5.47 0 9.1-3.85 9.1-9.27 0-.62-.07-1.1-.17-1.55z"/></svg>
                Continue with Google
              </Button>
              <Button onClick={() => setMode("email")} size="lg" variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Continue with Email
              </Button>
              <div className="relative my-3"><Separator /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or</span></div>
              <Button asChild size="lg" variant="ghost" className="w-full">
                <Link to="/guest"><Sparkles className="mr-2 h-4 w-4" /> Continue as Guest · 2 free scans</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={emailSubmit} className="mt-6 space-y-3">
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" /></div>
              <Button type="submit" disabled={busy} size="lg" className="w-full">{busy ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}</Button>
              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={() => setMode("choose")} className="text-muted-foreground hover:text-foreground">← Other options</button>
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">{isSignUp ? "Have an account? Sign in" : "New here? Create account"}</button>
              </div>
            </form>
          )}
          <p className="mt-6 text-center text-xs text-muted-foreground">By continuing you agree to scrape responsibly and respect each site's terms.</p>
        </div>
      </div>
    </div>
  );
}
