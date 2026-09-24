import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, ShieldCheck, Cpu, Terminal, KeyRound } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/app",
    };
  },
  head: () => ({
    meta: [
      { title: "Sign in — AI5K Network" },
      { name: "description", content: "Sign in to AI5K verified capability network." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const redirectTarget = search.redirect || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e?: React.FormEvent, asAdmin: boolean = false) => {
    if (e) e.preventDefault();
    
    const defaultEmail = asAdmin ? "admin.console@ai5k.network" : "demo.engineer@ai5k.network";
    const activeEmail = email.trim() || defaultEmail;
    const namePart = activeEmail.split("@")[0] || "demo user";
    const activeName = namePart.replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());
    const handle = namePart.replace(/[^a-z0-9]/gi, "").toLowerCase();
    
    const isAdminAccount = asAdmin || activeEmail.toLowerCase().includes("admin");

    localStorage.setItem("ai5k_authenticated", "true");
    localStorage.setItem("ai5k_user_email", activeEmail);
    localStorage.setItem("ai5k_user_name", activeName);
    localStorage.setItem("ai5k_user_handle", handle || "demouser");
    
    if (isAdminAccount) {
      localStorage.setItem("ai5k_user_is_admin", "true");
      localStorage.setItem("ai5k_user_roles", JSON.stringify(["professional", "organization", "buyer", "admin"]));
    } else {
      localStorage.setItem("ai5k_user_is_admin", "false");
      localStorage.setItem("ai5k_user_roles", JSON.stringify(["professional", "organization", "buyer"]));
    }

    if (!localStorage.getItem("ai5k_user_role")) {
      localStorage.setItem("ai5k_user_role", isAdminAccount ? "Platform Governance Admin" : "Verified AI Systems Specialist");
    }
    if (!localStorage.getItem("ai5k_user_bio")) {
      localStorage.setItem("ai5k_user_bio", "Architecting scalable AI capability networks and inspectable evidence pipelines.");
    }
    if (!localStorage.getItem("ai5k_user_index")) {
      localStorage.setItem("ai5k_user_index", "96.5");
    }
    if (!localStorage.getItem("ai5k_user_location")) {
      localStorage.setItem("ai5k_user_location", "San Francisco, CA / Remote");
    }
    
    if (redirectTarget.startsWith("/")) {
      window.location.href = redirectTarget;
    } else {
      navigate({ to: "/app" });
    }
  };

  const fillDemo = () => {
    const randomId = Math.floor(Math.random() * 9000 + 1000);
    setEmail(`demo.engineer${randomId}@ai5k.nexus`);
    setPassword(`nexus-pass-${randomId}`);
  };

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-[#15846E] selection:text-black">
      {/* LEFT COLUMN: BRAND & PROOF PANEL */}
      <div className="hidden lg:flex lg:w-1/2 border-r border-neutral-800 bg-neutral-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* Top Logo Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src="/ai5k_logo-removebg-preview.png" alt="AI5K Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        {/* Center Brand Statements */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#10b981]" />
            <span className="text-xs font-mono tracking-[0.2em] text-[#10b981] uppercase">
              CAPABILITY NETWORK
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-normal tracking-tight leading-[1.08] text-white">
            Proven capability.<br />
            <span className="text-neutral-400 font-light">Zero self-declared claims.</span>
          </h2>

          <div className="space-y-4 pt-4 border-t border-neutral-800 font-mono text-xs text-neutral-400">
            <div className="flex items-start gap-3">
              <span className="text-[#10b981] font-semibold">01</span>
              <span>Cryptographically verifiable execution logs & RAG benchmark evidence.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#10b981] font-semibold">02</span>
              <span>Role-based access across Pro, Delivery Pod, and Buyer workspaces.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#10b981] font-semibold">03</span>
              <span>Privileged operational console with real-time audit queue review.</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 font-mono text-xs text-neutral-500 flex items-center justify-between border-t border-neutral-900 pt-6">
          <span>AI5K NETWORK INC</span>
          <span>ENTERPRISE REPUTATION PLATFORM</span>
        </div>
      </div>

      {/* RIGHT COLUMN: AUTHENTICATION FORM */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-black">
        {/* Mobile Logo & Top Nav */}
        <div className="flex items-center justify-between w-full mb-8 lg:mb-0">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img src="/ai5k_logo-removebg-preview.png" alt="AI5K Logo" className="h-7 w-auto object-contain" />
          </Link>
          <div className="text-xs font-mono tracking-wider ml-auto">
            <span className="text-neutral-500 mr-2">Need an account?</span>
            <Link to="/auth/signup" className="text-[#10b981] hover:text-[#34d399] transition-colors font-medium">
              CREATE ACCOUNT
            </Link>
          </div>
        </div>

        {/* Main Form Center */}
        <main className="w-full max-w-md mx-auto my-auto py-8">
          <PageTransition className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-2">
                Sign in to AI5K
              </h1>
              <p className="text-xs font-mono text-neutral-400">
                Enter your credentials or select a dynamic session below.
              </p>
            </div>

            {/* Quick Demo Toolbar (Architectural Lines) */}
            <div className="p-4 border border-neutral-800 bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#10b981] flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Sparkles className="size-3.5" />
                  DYNAMIC ROLE ACCELERATOR
                </span>
                <button 
                  type="button" 
                  onClick={fillDemo}
                  className="text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Generate Credentials
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  type="button"
                  onClick={() => handleLogin(undefined, false)}
                  className="px-3 py-2 border border-neutral-800 bg-black text-neutral-300 hover:border-[#10b981] hover:text-[#10b981] font-mono text-[11px] text-left transition-colors"
                >
                  <div className="font-semibold">Standard User</div>
                  <div className="text-[10px] text-neutral-500 font-normal">Pro, Pod & Buyer Workspaces</div>
                </button>
                <button 
                  type="button"
                  onClick={() => handleLogin(undefined, true)}
                  className="px-3 py-2 border border-neutral-800 bg-black text-neutral-300 hover:border-purple-500 hover:text-purple-300 font-mono text-[11px] text-left transition-colors"
                >
                  <div className="font-semibold">Admin Console</div>
                  <div className="text-[10px] text-neutral-500 font-normal">Privileged Operations</div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">
                    Email Address
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

                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-neutral-400 text-xs font-mono tracking-wider uppercase">
                      Password
                    </Label>
                    <a href="#" className="text-xs font-mono text-[#10b981] hover:text-[#34d399] transition-colors">
                      Forgot?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 h-11 px-4 focus-visible:ring-1 focus-visible:ring-[#15846E] focus-visible:border-[#15846E] rounded-none font-mono text-xs transition-colors"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#15846E] hover:bg-[#10b981] text-black font-semibold rounded-none group transition-all font-mono text-xs tracking-wider"
              >
                SIGN IN
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </PageTransition>
        </main>

        {/* Footer */}
        <div className="text-xs font-mono text-neutral-500 text-center lg:text-left pt-4 border-t border-neutral-900">
          © 2026 AI5K Network Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
