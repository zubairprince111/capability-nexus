import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Wordmark } from "@/components/brand/logo";

export function SiteHeader({ variant = "minimal" }: { variant?: "default" | "minimal" }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white group shrink-0">
          <img src="/ai5k_logo-removebg-preview.png" alt="AI5K Logo" className="h-8 w-auto object-contain" />
        </Link>

        {/* Main Capability Navigation */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-6 font-mono text-xs tracking-wider uppercase text-neutral-400">
          <Link 
            to="/discover" 
            className="hover:text-emerald-400 transition-colors py-1" 
            activeProps={{ className: "text-[#10b981] font-semibold" }}
          >
            Explore
          </Link>
          <Link 
            to="/auth/signup" 
            className="hover:text-white transition-colors py-1" 
          >
            AI Agents
          </Link>
          <Link 
            to="/auth/signup" 
            className="hover:text-white transition-colors py-1" 
          >
            AI Services
          </Link>
          <Link 
            to="/auth/signup" 
            className="hover:text-white transition-colors py-1" 
          >
            Experts
          </Link>
          <Link 
            to="/auth/signup" 
            className="hover:text-white transition-colors py-1" 
          >
            Organizations
          </Link>
        </nav>

        {/* Header Action Buttons */}
        <div className="hidden sm:flex items-center gap-5">
          <Link
            to="/auth/login"
            className="text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            SIGN IN
          </Link>
          <Button
            asChild
            className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold px-4 font-mono text-xs tracking-wider rounded-none transition-all"
          >
            <Link to="/auth/signup">GET STARTED</Link>
          </Button>
        </div>

        {/* Mobile Navigation Sheet */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="size-5" />
                <span className="sr-only">Toggle Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white border-white/10 p-6 flex flex-col justify-between">
              <SheetTitle className="text-lg font-mono font-bold tracking-widest text-emerald-400 mb-6">
                AI5K
              </SheetTitle>
              <div className="flex flex-col gap-5 font-mono text-sm tracking-wider uppercase text-neutral-300">
                <Link to="/discover" onClick={() => setOpen(false)} className="hover:text-emerald-400 py-1">
                  Explore
                </Link>
                <Link to="/auth/signup" onClick={() => setOpen(false)} className="hover:text-emerald-400 py-1">
                  AI Agents
                </Link>
                <Link to="/auth/signup" onClick={() => setOpen(false)} className="hover:text-emerald-400 py-1">
                  AI Services
                </Link>
                <Link to="/auth/signup" onClick={() => setOpen(false)} className="hover:text-emerald-400 py-1">
                  Experts
                </Link>
                <Link to="/auth/signup" onClick={() => setOpen(false)} className="hover:text-emerald-400 py-1">
                  Organizations
                </Link>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <Button asChild className="bg-[#15846E] hover:bg-[#10b981] text-black font-bold w-full rounded-none font-mono text-xs">
                  <Link to="/auth/login" onClick={() => setOpen(false)}>SIGN IN</Link>
                </Button>
                <Button asChild variant="outline" className="border-neutral-800 text-white w-full rounded-none font-mono text-xs">
                  <Link to="/auth/signup" onClick={() => setOpen(false)}>GET STARTED</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ variant = "default" }: { variant?: "default" | "light" }) {
  const isLight = variant === "light";

  return (
    <footer className={cn(
      "relative w-full overflow-hidden border-t transition-colors",
      isLight ? "bg-[#F5F2EC] text-stone-900 border-stone-300/80" : "bg-black text-white border-white/10"
    )}>
      <div className={cn(
        "absolute top-0 inset-x-0 h-[1px]",
        isLight ? "bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" : "bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
      )} />
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-3xl pointer-events-none rounded-full",
        isLight ? "bg-emerald-600/5" : "bg-emerald-500/5"
      )} />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-8">
        <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b", isLight ? "border-stone-300/70" : "border-white/10")}>
          
          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Wordmark />
                <span className="text-white/30 font-mono text-sm">/</span>
                <img src="/cloudcamp.png" alt="CloudCamp Logo" className="h-7 w-auto object-contain shrink-0" />
                <span className={cn(
                  "text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ml-1",
                  isLight ? "bg-emerald-600/10 border-emerald-600/30 text-emerald-800" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                )}>
                  Verified Capability
                </span>
              </div>
              <p className={cn("text-sm leading-relaxed max-w-sm font-light", isLight ? "text-stone-600" : "text-neutral-400")}>
                Proven, not claimed. Discover AI agents, services, experts, and delivery pods backed by cryptographically verifiable proof.
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className={cn("font-mono text-[11px] font-semibold tracking-[0.2em] uppercase", isLight ? "text-stone-500" : "text-neutral-400")}>
              Marketplace
            </h4>
            <ul className={cn("space-y-2.5 text-sm font-light", isLight ? "text-stone-700" : "text-neutral-400")}>
              <li>
                <Link to="/auth/signup" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  AI Agents & Swarms
                </Link>
              </li>
              <li>
                <Link to="/auth/signup" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  AI Services & Workflows
                </Link>
              </li>
              <li>
                <Link to="/auth/signup" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  Verified AI Experts
                </Link>
              </li>
              <li>
                <Link to="/auth/signup" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  Delivery Pods & Organizations
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className={cn("font-mono text-[11px] font-semibold tracking-[0.2em] uppercase", isLight ? "text-stone-500" : "text-neutral-400")}>
              Governance & Proof
            </h4>
            <ul className={cn("space-y-2.5 text-sm font-light", isLight ? "text-stone-700" : "text-neutral-400")}>
              <li>
                <Link to="/auth/signup" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  Evidence Vault & Audit
                </Link>
              </li>
              <li>
                <Link to="/manifesto" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  Manifesto
                </Link>
              </li>
              <li>
                <Link to="/terms" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={cn("transition-colors", isLight ? "hover:text-emerald-700" : "hover:text-white")}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={cn("pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4", isLight ? "text-stone-500" : "text-neutral-500")}>
          <p>© 2026 AI5K Network Inc. Proven, not claimed.</p>
          <div className="flex gap-6">
            <Link to="/terms" className={cn("transition-colors", isLight ? "hover:text-stone-900" : "hover:text-neutral-300")}>Terms</Link>
            <Link to="/privacy" className={cn("transition-colors", isLight ? "hover:text-stone-900" : "hover:text-neutral-300")}>Privacy</Link>
            <Link to="/docs" className={cn("transition-colors", isLight ? "hover:text-stone-900" : "hover:text-neutral-300")}>Documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
