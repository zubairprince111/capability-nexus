import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Compass } from "lucide-react";
import { AI5KBrain } from "@/components/3d/ai5k-brain";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/site-chrome";

export function AI5KHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationY, setRotationY] = useState(-Math.PI / 2);
  const [introStage, setIntroStage] = useState<"loading" | "center-brain" | "shifting" | "complete">("loading");

  const handleBrainLoad = () => {
    setIntroStage("center-brain");
    setTimeout(() => {
      setIntroStage("shifting");
      setTimeout(() => {
        setIntroStage("complete");
      }, 1500); // Wait 1.5s for brain to shift
    }, 2800); // Show center brain for 2.8s while it slowly fades in
  };

  // Track scroll position inside the 400vh container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const totalScrollable = containerHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress from 0 to 1
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate opacity & visibility for each scroll stage
  // Stage 1: Hero (0 - 0.25)
  const baseHeroOpacity = Math.max(0, Math.min(1, (0.22 - scrollProgress) / 0.15));
  const heroOpacity = introStage === "complete" ? baseHeroOpacity : 0;
  
  // Stage 2: Evidence (0.30 - 0.58)
  const evidenceOpacity = scrollProgress >= 0.28 && scrollProgress <= 0.60
    ? scrollProgress < 0.42
      ? (scrollProgress - 0.28) / 0.14
      : (0.60 - scrollProgress) / 0.18
    : 0;

  // Stage 3: Capability Network (0.62 - 0.82)
  const networkOpacity = scrollProgress >= 0.60 && scrollProgress <= 0.84
    ? scrollProgress < 0.72
      ? (scrollProgress - 0.60) / 0.12
      : (0.84 - scrollProgress) / 0.12
    : 0;

  // Stage 4: Discovery (0.85 - 1.0)
  const discoveryOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.84) / 0.12));

  // Brain X Offset transitions from right (3.2) towards center (0) as particles disperse
  let brainXOffset = 3.2;
  if (introStage === "loading" || introStage === "center-brain") {
    brainXOffset = 0;
  } else if (introStage === "shifting" || introStage === "complete") {
    brainXOffset = scrollProgress < 0.25 
      ? 3.2 
      : Math.max(0, 3.2 * (1 - (scrollProgress - 0.25) / 0.25));
  }

  return (
    <>
      <div ref={containerRef} className="relative w-full h-[400vh] bg-black text-white font-sans">
        {/* STICKY STAGE CONTAINER (100vh) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col">
        
        {/* ULTRA-MINIMAL NAVBAR (INTEGRATED INTO CANVAS / NAVBAR ILLUSION) */}
        <header className={`relative z-30 flex items-center justify-between px-6 py-6 lg:px-16 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px] transition-opacity duration-1000 ${introStage === "complete" ? "opacity-100" : "opacity-0"}`}>
          <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white group">
            <span className="flex size-7 items-center justify-center rounded-sm bg-[#15846E]/15 border border-[#15846E]/40 text-[#10b981] group-hover:border-[#10b981] transition-colors">
              <ShieldCheck className="size-4 text-[#10b981]" />
            </span>
            <span className="font-mono font-bold tracking-[0.25em] text-xl text-white">AI5K</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/auth/login"
              className="text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              SIGN IN
            </Link>
            <Button
              asChild
              className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold px-5 font-mono text-xs tracking-wider rounded-none transition-all"
            >
              <Link to="/auth/signup">CREATE ACCOUNT</Link>
            </Button>
          </div>
        </header>

        {/* 3D WEBGL BRAIN & PARTICLE SYSTEM CANVAS */}
        <div className="absolute inset-0 z-10 size-full pointer-events-auto">
          <AI5KBrain
            interactive={true}
            scrollProgress={scrollProgress}
            rotationYOffset={rotationY}
            positionXOffset={brainXOffset}
            onLoad={handleBrainLoad}
          />
        </div>

        {/* OVERLAYS CONTAINER */}
        <div className="relative z-20 pointer-events-none mx-auto max-w-7xl px-6 lg:px-16 w-full flex-1 flex flex-col justify-center">

          {/* 1. HERO OVERLAY (0 - 25% Scroll) */}
          <div
            className="max-w-2xl transition-all duration-700 ease-out"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${(1 - heroOpacity) * -30}px)`,
              pointerEvents: heroOpacity > 0.3 ? "auto" : "none",
              display: heroOpacity > 0.01 ? "block" : "none",
            }}
          >
            {/* EYEBROW */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="size-1.5 rounded-full bg-[#15846E]" />
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-400">
                Verified AI Capability Network
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-5xl sm:text-7xl lg:text-[90px] font-normal tracking-[-0.03em] leading-[0.98] text-white mb-8">
              AI capability.<br />
              <span className="text-neutral-300 font-normal">Proven,</span> not claimed.
            </h1>

            {/* SUPPORTING TEXT */}
            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-lg mb-10">
              Find the people, organizations and AI systems that can actually build what you need.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-sm px-8 py-6 rounded-none group transition-all"
              >
                <Link to="/app">
                  Explore capability
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-neutral-800 bg-black/60 hover:bg-neutral-900 text-neutral-300 text-sm px-8 py-6 rounded-none backdrop-blur-md hover:text-white"
              >
                <Link to="/about">
                  Build with AI5K
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. EVIDENCE OVERLAY (28% - 60% Scroll) */}
          <div
            className="max-w-2xl mx-auto text-center transition-all duration-700 ease-out"
            style={{
              opacity: evidenceOpacity,
              transform: `translateY(${(1 - evidenceOpacity) * 20}px)`,
              pointerEvents: evidenceOpacity > 0.3 ? "auto" : "none",
              display: evidenceOpacity > 0.01 ? "block" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="text-xs font-mono tracking-[0.25em] text-[#15846E] uppercase">
                01 / EVIDENCE
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.03em] leading-[1.05] text-white mb-6">
              Capability is easy to claim.<br />
              <span className="text-neutral-300">Evidence makes it useful.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-xl mx-auto mb-10">
              AI5K connects capability to the proof behind it.
            </p>

            {/* Minimal node pills */}
            <div className="flex flex-wrap justify-center gap-3 font-mono text-xs tracking-widest text-neutral-300">
              {["PROJECT", "OUTCOME", "ASSESSMENT", "CERTIFICATION", "VERIFICATION"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-neutral-800 bg-black/80 rounded-none text-neutral-300 hover:border-[#15846E] hover:text-white transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. CAPABILITY NETWORK OVERLAY (60% - 84% Scroll) */}
          <div
            className="max-w-2xl mx-auto text-center transition-all duration-700 ease-out"
            style={{
              opacity: networkOpacity,
              transform: `translateY(${(1 - networkOpacity) * 20}px)`,
              pointerEvents: networkOpacity > 0.3 ? "auto" : "none",
              display: networkOpacity > 0.01 ? "block" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="text-xs font-mono tracking-[0.25em] text-[#15846E] uppercase">
                02 / NETWORK
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.03em] leading-[1.05] text-white mb-6">
              One network.<br />
              <span className="text-neutral-300">Every kind of capability.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-xl mx-auto mb-10">
              A unified lattice connecting people, organizations, services and autonomous AI systems.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto font-mono text-xs tracking-widest">
              {[
                { title: "PEOPLE", sub: "Verified Creators" },
                { title: "ORGANIZATIONS", sub: "Attested Labs" },
                { title: "SERVICES", sub: "Audited APIs" },
                { title: "AI SYSTEMS", sub: "Replicated Models" },
              ].map((item) => (
                <div key={item.title} className="p-4 border border-neutral-800 bg-black/90 text-left group hover:border-[#15846E] transition-colors">
                  <div className="text-white font-semibold mb-1 group-hover:text-white transition-colors">{item.title}</div>
                  <div className="text-[10px] text-neutral-500 font-normal">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. DISCOVERY OVERLAY (85% - 100% Scroll) */}
          <div
            className="max-w-2xl mx-auto text-center transition-all duration-700 ease-out"
            style={{
              opacity: discoveryOpacity,
              transform: `translateY(${(1 - discoveryOpacity) * 20}px)`,
              pointerEvents: discoveryOpacity > 0.3 ? "auto" : "none",
              display: discoveryOpacity > 0.01 ? "block" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="text-xs font-mono tracking-[0.25em] text-[#15846E] uppercase">
                03 / DISCOVERY
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.03em] leading-[1.05] text-white mb-6">
              Find who can<br />
              <span className="text-neutral-300">actually build it.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-xl mx-auto mb-10">
              Search verified entities, inspect reproducible proof, and connect directly with true capability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-sm px-8 py-6 rounded-none group transition-all"
              >
                <Link to="/app">
                  EXPLORE CAPABILITY
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-neutral-800 bg-black/60 hover:bg-neutral-900 text-neutral-300 text-sm px-8 py-6 rounded-none backdrop-blur-md hover:text-white"
              >
                <Link to="/auth/signup">
                  BUILD WITH AI5K
                </Link>
              </Button>
            </div>
          </div>

        </div>

      </div>
      
    </div>

      <SiteFooter />
    </>
  );
}
