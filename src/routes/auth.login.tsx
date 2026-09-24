import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Sparkles, KeyRound } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AI5K" },
      { name: "description", content: "Sign in to AI5K." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Store dynamic user session (not hardcoded) with full profile info
    const activeEmail = email.trim() || "demo.engineer@ai5k.network";
    const namePart = activeEmail.split("@")[0] || "demo engineer";
    const activeName = namePart.replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
    const handle = namePart.replace(/[^a-z0-9]/gi, "").toLowerCase();
    
    localStorage.setItem("ai5k_authenticated", "true");
    localStorage.setItem("ai5k_user_email", activeEmail);
    localStorage.setItem("ai5k_user_name", activeName);
    localStorage.setItem("ai5k_user_handle", handle || "demoengineer");
    if (!localStorage.getItem("ai5k_user_role")) {
      localStorage.setItem("ai5k_user_role", "Verified AI Infrastructure Specialist");
    }
    if (!localStorage.getItem("ai5k_user_bio")) {
      localStorage.setItem("ai5k_user_bio", "Architecting scalable LLM inference pipelines, multi-modal embeddings, and autonomous agent swarms.");
    }
    if (!localStorage.getItem("ai5k_user_index")) {
      localStorage.setItem("ai5k_user_index", "95.2");
    }
    if (!localStorage.getItem("ai5k_user_location")) {
      localStorage.setItem("ai5k_user_location", "San Francisco, CA / Remote");
    }
    
    navigate({ to: "/app" });
  };

  const fillDemo = () => {
    // Generate dynamic demo credentials
    const randomId = Math.floor(Math.random() * 9000 + 1000);
    setEmail(`demo.engineer${randomId}@ai5k.nexus`);
    setPassword(`nexus-pass-${randomId}`);
  };

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#15846E]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 lg:px-16 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white group">
          <span className="flex size-7 items-center justify-center rounded-sm bg-[#15846E]/15 border border-[#15846E]/40 text-[#10b981] group-hover:border-[#10b981] transition-colors">
            <ShieldCheck className="size-4 text-[#10b981]" />
          </span>
          <span className="font-mono font-bold tracking-[0.25em] text-xl text-white">AI5K</span>
        </Link>
        <Link to="/auth/signup" className="text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors">
          CREATE ACCOUNT
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 relative z-10 px-4">
        <PageTransition className="w-full max-w-sm space-y-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-normal tracking-tight text-white mb-2">Sign in</h1>
            <p className="text-neutral-400 text-sm">Enter credentials or use dynamic demo access.</p>
          </div>

          {/* Quick Demo Access Box */}
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-emerald-500/20 text-left space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                Dynamic Demo Access
              </span>
              <button 
                type="button" 
                onClick={fillDemo}
                className="text-[11px] font-mono text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
              >
                Auto-generate
              </button>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              No hardcoded credentials required. Type any email or click below for instant access.
            </p>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => handleLogin()}
              className="w-full h-9 border-emerald-500/30 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-500 hover:text-black font-mono text-xs transition-all rounded-none"
            >
              <KeyRound className="size-3.5 mr-2" />
              One-Click Demo Sign In
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#15846E] focus-visible:border-[#15846E] rounded-none transition-colors"
                />
              </div>
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">Password</Label>
                  <a href="#" className="text-xs text-[#10b981] hover:text-[#34d399] transition-colors">Forgot password?</a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#15846E] focus-visible:border-[#15846E] rounded-none transition-colors"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-[#15846E] hover:bg-[#10b981] text-black font-semibold rounded-none group transition-all text-sm tracking-wide mt-2">
              Sign In
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          
          <div className="text-center text-sm text-neutral-500 pt-2">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-white hover:text-[#10b981] transition-colors font-medium">
              Create account
            </Link>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
