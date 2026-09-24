import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create account — AI5K" },
      { name: "description", content: "Create an AI5K account." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dynamically store new user session with detailed profile info
    const activeName = name.trim() || "Ada Lovelace";
    const activeEmail = email.trim() || "ada.lovelace@ai5k.network";
    const handle = activeName.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    localStorage.setItem("ai5k_authenticated", "true");
    localStorage.setItem("ai5k_user_email", activeEmail);
    localStorage.setItem("ai5k_user_name", activeName);
    localStorage.setItem("ai5k_user_handle", handle || "adalovelace");
    localStorage.setItem("ai5k_user_role", "Senior AI Systems & LLM Engineer");
    localStorage.setItem("ai5k_user_bio", "Building autonomous AI agents, RAG pipelines, and fine-tuning open-source models with verified cryptographic proof.");
    localStorage.setItem("ai5k_user_index", "96.8");
    localStorage.setItem("ai5k_user_location", "Global Remote / San Francisco");
    
    navigate({ to: "/app" });
  };

  const fillDemo = () => {
    const randomId = Math.floor(Math.random() * 9000 + 1000);
    setName(`AI Architect ${randomId}`);
    setEmail(`architect${randomId}@ai5k.nexus`);
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
        <Link to="/auth/login" className="text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors">
          SIGN IN
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 relative z-10 px-4">
        <PageTransition className="w-full max-w-sm space-y-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-normal tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-neutral-400 text-sm">Join the verified capability network.</p>
          </div>

          {/* Quick Generator Bar */}
          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-emerald-500/20 text-left flex items-center justify-between backdrop-blur-md">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Dynamic Profile
            </span>
            <button 
              type="button" 
              onClick={fillDemo}
              className="text-xs font-mono text-neutral-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              Generate Demo Profile
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#15846E] focus-visible:border-[#15846E] rounded-none transition-colors"
                />
              </div>
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
            </div>

            <Button type="submit" className="w-full h-12 bg-[#15846E] hover:bg-[#10b981] text-black font-semibold rounded-none group transition-all text-sm tracking-wide mt-2">
              Create Account
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          
          <div className="text-center text-sm text-neutral-500 pt-2">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-white hover:text-[#10b981] transition-colors font-medium">
              Sign in
            </Link>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
