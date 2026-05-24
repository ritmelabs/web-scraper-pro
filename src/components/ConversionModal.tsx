import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { lovable } from "@/integrations/lovable";
import { useNavigate } from "@tanstack/react-router";

export function ConversionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const google = async () => {
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">You've used your free scans</DialogTitle>
          <DialogDescription className="text-center">
            Create a free account to continue extracting and organizing data — unlimited resources, saved history, and AI analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Button onClick={google} size="lg" className="w-full">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.92h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.72 1.43l2.54-2.45C16.84 3.7 14.74 2.8 12.18 2.8 6.93 2.8 2.7 7.03 2.7 12.26s4.23 9.46 9.48 9.46c5.47 0 9.1-3.85 9.1-9.27 0-.62-.07-1.1-.17-1.55z"/></svg>
            Continue with Google
          </Button>
          <Button onClick={() => navigate({ to: "/login" })} size="lg" variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" /> Continue with Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
