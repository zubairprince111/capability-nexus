import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { 
  Laptop, 
  Copy, 
  Check, 
  ArrowRight, 
  Compass, 
  Home, 
  ShieldCheck, 
  LogOut,
  Monitor
} from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function DesktopRequiredNotice() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai5k_authenticated");
      localStorage.removeItem("ai5k_user_name");
      localStorage.removeItem("ai5k_user_email");
      localStorage.removeItem("ai5k_user_handle");
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-dvh w-full bg-black text-white flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:24px_24px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto border-b border-white/10 pb-6">
        <Link to="/" aria-label="AI5K home">
          <Wordmark />
        </Link>
        <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Mission Control Active
        </span>
      </header>

      {/* Main Notice Content */}
      <main className="relative z-10 my-auto max-w-xl mx-auto text-center space-y-8 py-8">
        
        {/* Minimalist Desktop Workspace Visual Hint */}
        <div className="relative mx-auto w-56 h-36 rounded-xl border border-emerald-500/30 bg-neutral-950/80 p-2.5 shadow-2xl backdrop-blur-md flex flex-col justify-between group">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <div className="flex gap-1">
              <span className="size-2 rounded-full bg-red-500/60" />
              <span className="size-2 rounded-full bg-amber-500/60" />
              <span className="size-2 rounded-full bg-emerald-500/60" />
            </div>
            <span className="font-mono text-[8px] text-emerald-400/80 tracking-widest uppercase">
              AI5K OS v1.0
            </span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 flex-1 pt-1.5">
            <div className="col-span-3 rounded bg-white/5 border border-white/10 p-1 flex flex-col gap-1">
              <div className="h-1.5 w-full bg-emerald-500/40 rounded" />
              <div className="h-1.5 w-3/4 bg-white/10 rounded" />
              <div className="h-1.5 w-1/2 bg-white/10 rounded" />
            </div>
            <div className="col-span-9 rounded bg-white/5 border border-white/10 p-1.5 space-y-1">
              <div className="h-2 w-full bg-white/15 rounded" />
              <div className="grid grid-cols-2 gap-1 pt-0.5">
                <div className="h-10 rounded bg-emerald-500/10 border border-emerald-500/20" />
                <div className="h-10 rounded bg-white/5 border border-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Headings */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs tracking-widest uppercase">
            <Monitor className="size-3.5" />
            Desktop Operating Environment
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
            AI5K works best on desktop.
          </h1>
          
          <p className="text-sm sm:text-base text-emerald-400/90 font-mono tracking-wide">
            You're entering Mission Control.
          </p>
        </div>

        {/* Description Body */}
        <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-md mx-auto">
          The AI5K workspace is built for a larger screen so you can work comfortably with capabilities, opportunities, engagements, and everything else in one place.
          <br className="hidden sm:inline" /> Please open AI5K on a laptop or desktop to continue.
        </p>

        {/* Primary Action Button */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleCopyLink}
            size="lg"
            className="w-full sm:w-auto bg-[#15846E] hover:bg-[#10b981] text-black font-semibold font-mono text-xs tracking-wider rounded-none px-8 h-12 shadow-lg transition-all"
          >
            {copied ? (
              <>
                <Check className="size-4 mr-2 text-black" />
                Link Copied! Open on Desktop
              </>
            ) : (
              <>
                <Copy className="size-4 mr-2" />
                Continue on Desktop
              </>
            )}
          </Button>

          {copied && (
            <p className="text-[11px] font-mono text-emerald-400/90 animate-fade-in">
              URL copied to clipboard. Paste this link into your laptop or desktop browser.
            </p>
          )}
        </div>

        {/* Mobile Navigation Alternative Links */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <Button
            asChild
            variant="outline"
            className="border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 text-neutral-300 hover:text-white font-mono text-xs rounded-none h-10 gap-2"
          >
            <Link to="/discover">
              <Compass className="size-3.5 text-emerald-400" />
              Explore Marketplace
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 text-neutral-300 hover:text-white font-mono text-xs rounded-none h-10 gap-2"
          >
            <Link to="/">
              <Home className="size-3.5 text-neutral-400" />
              Return to Homepage
            </Link>
          </Button>
        </div>

      </main>

      {/* Footer Status */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl mx-auto border-t border-white/10 pt-6 text-[11px] font-mono text-neutral-400 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>Session Active & Secured</span>
        </div>
        <button
          onClick={handleSignOut}
          className="hover:text-red-400 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="size-3" />
          <span>Sign Out</span>
        </button>
      </footer>
    </div>
  );
}
