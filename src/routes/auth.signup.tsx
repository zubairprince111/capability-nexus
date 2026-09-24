import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create account — AI5K Network" },
      { name: "description", content: "Create an AI5K verified account." },
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
    <div className="min-h-dvh bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-[#15846E] selection:text-black">
      {/* LEFT COLUMN: BRAND PANEL */}
      <div className="hidden lg:flex lg:w-1/2 border-r border-neutral-800 bg-neutral-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* Top Logo Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src="/ai5k_logo-removebg-preview.png" alt="AI5K Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#10b981]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#10b981] uppercase">
              JOIN THE NETWORK
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-normal tracking-tight leading-[1.08] text-white">
            Build AI.<br />
            <span className="text-neutral-400 font-light">Earn globally with proof.</span>
          </h2>

          <div className="space-y-4 pt-4 border-t border-neutral-800 font-mono text-xs text-neutral-400">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-4 text-[#10b981] shrink-0 mt-0.5" />
              <span>Instant access to Pro, Organization, and Buyer intake workspaces.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-4 text-[#10b981] shrink-0 mt-0.5" />
              <span>Connect GitHub repositories to automatically index inspectable code proof.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-4 text-[#10b981] shrink-0 mt-0.5" />
              <span>Access global enterprise opportunities backed by platform escrow contracts.</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 font-mono text-xs text-neutral-500 flex items-center justify-between border-t border-neutral-900 pt-6">
          <span>AI5K NETWORK INC</span>
          <span>VERIFIED CAPABILITY INFRASTRUCTURE</span>
        </div>
      </div>

      {/* RIGHT COLUMN: SIGNUP FORM */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-black">
        {/* Mobile Header & Top Nav */}
        <div className="flex items-center justify-between w-full mb-8 lg:mb-0">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img src="/ai5k_logo-removebg-preview.png" alt="AI5K Logo" className="h-7 w-auto object-contain" />
          </Link>
          <div className="text-xs font-mono tracking-wider ml-auto">
            <span className="text-neutral-500 mr-2">Already registered?</span>
            <Link to="/auth/login" className="text-[#10b981] hover:text-[#34d399] transition-colors font-medium">
              SIGN IN
            </Link>
          </div>
        </div>

        {/* Main Form Center */}
        <main className="w-full max-w-md mx-auto my-auto py-8">
          <PageTransition className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-2">
                Create your account
              </h1>
              <p className="text-xs font-mono text-neutral-400">
                Join the verified global AI capability & commerce network.
              </p>
            </div>

            {/* Dynamic Profile Demo Bar */}
            <div className="p-4 border border-neutral-800 bg-neutral-950 flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#10b981] flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                <Sparkles className="size-3.5" />
                DYNAMIC PROFILE DEMO
              </span>
              <button 
                type="button" 
                onClick={fillDemo}
                className="text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
              >
                Auto-fill Profile
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="name" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">
                    Full Name
                  </Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 h-11 px-4 focus-visible:ring-1 focus-visible:ring-[#15846E] focus-visible:border-[#15846E] rounded-none font-mono text-xs transition-colors"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">
                    Work Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 h-11 px-4 focus-visible:ring-1 focus-visible:ring-[#15846E] focus-visible:border-[#15846E] rounded-none font-mono text-xs transition-colors"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#15846E] hover:bg-[#10b981] text-black font-semibold rounded-none group transition-all font-mono text-xs tracking-wider"
              >
                CREATE ACCOUNT
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </PageTransition>
        </main>

        {/* Footer */}
        <div className="text-xs font-mono text-neutral-500 text-center lg:text-left pt-4 border-t border-neutral-900">
          By signing up you agree to AI5K{" "}
          <Link to="/terms" className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2 transition-colors">
            Terms of Service
          </Link>{" "}
          &amp;{" "}
          <Link to="/privacy" className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>.
        </div>
      </div>
    </div>
  );
}
