import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/theme";

const LINKS: { to: string; label: string }[] = [];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white group">
          <span className="flex size-7 items-center justify-center rounded-sm bg-[#15846E]/15 border border-[#15846E]/40 text-[#10b981] group-hover:border-[#10b981] transition-colors">
            <ShieldCheck className="size-4 text-[#10b981]" />
          </span>
          <span className="font-mono font-bold tracking-[0.25em] text-xl text-white">AI5K</span>
        </Link>

        {/* Center Links */}
        <nav aria-label="Primary" className="flex items-center gap-8 font-mono text-xs tracking-widest uppercase text-neutral-400">
          <Link 
            to="/manifesto" 
            className="hover:text-white transition-colors py-1" 
            activeProps={{ className: "text-[#10b981] font-medium" }}
          >
            Manifesto
          </Link>
          <Link 
            to="/terms" 
            className="hover:text-white transition-colors py-1" 
            activeProps={{ className: "text-[#10b981] font-medium" }}
          >
            Terms
          </Link>
          <Link 
            to="/privacy" 
            className="hover:text-white transition-colors py-1" 
            activeProps={{ className: "text-[#10b981] font-medium" }}
          >
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-black text-white border-t border-white/10">
      {/* Top Ambient Glow & Gradient Border */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono font-bold tracking-[0.25em] text-2xl text-white">AI5K</span>
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Nexus Network
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm font-light">
                Verified AI capability for global work. Connecting engineering talent, autonomous systems, and enterprise projects through cryptographic proof.
              </p>
            </div>


          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-light">
              <li>
                <Link to="/auth/login" className="hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                  Capability Network
                </Link>
              </li>
              <li>
                <Link to="/manifesto" className="hover:text-white transition-colors duration-200">
                  Manifesto
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              Governance
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400 font-light">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* CloudCamp Sponsor Section - Borderless */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase block">
              Brought to you by
            </span>
            
            <a 
              href="https://cloudcampbd.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block group"
            >
              <div className="bg-white px-3.5 py-2 rounded-lg inline-flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <img 
                  src="/cloudcamp.png" 
                  alt="CloudCamp Bangladesh" 
                  className="h-7 object-contain" 
                />
              </div>
            </a>
          </div>

        </div>

        {/* Sub-footer / Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} AI5K Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">

            <span className="hidden md:inline">Global Capability Verification Engine</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
