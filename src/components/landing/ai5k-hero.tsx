import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Cpu, Code2, Users, Zap, Search } from "lucide-react";
import { AI5KBrain } from "@/components/3d/ai5k-brain";
import { Button } from "@/components/ui/button";

function checkIntroPlayed(): boolean {
  if (typeof window === "undefined") return false;
  // Use in-memory flag (persists for SPA navigation, but resets on page refresh)
  if ((window as any).__AI5K_INTRO_PLAYED__) return true;
  return false;
}

function markIntroPlayed(): void {
  if (typeof window === "undefined") return;
  (window as any).__AI5K_INTRO_PLAYED__ = true;
}

export function AI5KHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationY, setRotationY] = useState(-Math.PI / 2);
  const [introStage, setIntroStage] = useState<"loading" | "center-brain" | "shifting" | "text-reveal" | "complete">(() => {
    return checkIntroPlayed() ? "complete" : "loading";
  });

  const introTimersRef = useRef<NodeJS.Timeout[]>([]);

  const finishIntro = () => {
    setIntroStage("complete");
    markIntroPlayed();
  };

  const handleBrainLoad = () => {
    if (checkIntroPlayed()) {
      finishIntro();
      return;
    }

    // 1. Dark background with glowing brain first in center
    setIntroStage("center-brain");

    // 2. Brain shifts smoothly to the right
    const t1 = setTimeout(() => {
      setIntroStage("shifting");

      // 3. At the right side, text reveals slowly & gradually
      const t2 = setTimeout(() => {
        setIntroStage("text-reveal");

        // 4. Finally, top navbar and UI appear
        const t3 = setTimeout(() => {
          finishIntro();
        }, 1400);
        introTimersRef.current.push(t3);
      }, 900);
      introTimersRef.current.push(t2);
    }, 1000);
    introTimersRef.current.push(t1);
  };

  // Safety fallback: ensure page is never stuck if 3D model takes too long or fails
  useEffect(() => {
    // Clean up any stale storage keys left from previous versions of this code
    try { 
      localStorage.removeItem("ai5k_hero_intro_played"); 
      sessionStorage.removeItem("ai5k_hero_intro_played");
    } catch (e) {}

    if (checkIntroPlayed()) {
      setIntroStage("complete");
      return;
    }

    const safetyTimer = setTimeout(() => {
      finishIntro();
    }, 5000);

    return () => {
      clearTimeout(safetyTimer);
      introTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const totalScrollable = containerHeight - viewportHeight;

      if (totalScrollable <= 0) return;

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

  // Stage 1: Hero (0 - 0.25)
  const baseHeroOpacity = Math.max(0, Math.min(1, (0.22 - scrollProgress) / 0.15));
  let heroOpacity = 0;
  if (introStage === "complete") {
    heroOpacity = baseHeroOpacity;
  } else if (introStage === "text-reveal") {
    heroOpacity = 1;
  } else {
    heroOpacity = 0;
  }
  
  // Stage 2: Discovery Categories (0.30 - 0.58)
  const discoveryOpacity = scrollProgress >= 0.28 && scrollProgress <= 0.60
    ? scrollProgress < 0.42
      ? (scrollProgress - 0.28) / 0.14
      : (0.60 - scrollProgress) / 0.18
    : 0;

  // Stage 3: Intake Trigger (0.62 - 0.82)
  const intakeOpacity = scrollProgress >= 0.60 && scrollProgress <= 0.84
    ? scrollProgress < 0.72
      ? (scrollProgress - 0.60) / 0.12
      : (0.84 - scrollProgress) / 0.12
    : 0;

  // Stage 4: Proof & Commercial Execution (0.85 - 1.0)
  const executionOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.84) / 0.12));

  // Brain X Offset transitions from right (4.5) towards center (0) as particles disperse
  let brainXOffset = 4.5;
  if (introStage === "loading" || introStage === "center-brain") {
    brainXOffset = 0;
  } else if (introStage === "shifting" || introStage === "text-reveal" || introStage === "complete") {
    brainXOffset = scrollProgress < 0.25 
      ? 4.5 
      : Math.max(0, 4.5 * (1 - (scrollProgress - 0.25) / 0.25));
  }

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-black text-white font-sans">
        {/* STICKY STAGE CONTAINER (100vh) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col">
        
        {/* PUBLIC NAVBAR */}
        <header className={`relative z-30 flex items-center justify-between px-6 py-6 lg:px-16 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px] transition-opacity duration-1000 ${introStage === "complete" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Link to="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white group">
            <img src="/ai5k_logo-removebg-preview.png" alt="AI5K Logo" className="h-8 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs tracking-wider uppercase text-neutral-400">
            <Link to="/discover" className="hover:text-emerald-400 text-emerald-400/90 font-medium transition-colors">Explore</Link>
            <Link to="/auth/signup" className="hover:text-white transition-colors">AI Agents</Link>
            <Link to="/auth/signup" className="hover:text-white transition-colors">AI Services</Link>
            <Link to="/auth/signup" className="hover:text-white transition-colors">Experts</Link>
            <Link to="/auth/signup" className="hover:text-white transition-colors">Organizations</Link>
          </div>

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
              <Link to="/auth/signup">GET STARTED</Link>
            </Button>
          </div>
        </header>

        {/* 3D WEBGL BRAIN CANVAS */}
        <div className="absolute inset-0 z-10 size-full pointer-events-auto">
          <AI5KBrain
            interactive={true}
            scrollProgress={scrollProgress}
            rotationYOffset={rotationY}
            positionXOffset={brainXOffset}
            onLoad={handleBrainLoad}
            bgColor="#000000"
          />
        </div>

        {/* OVERLAYS CONTAINER */}
        <div className="relative z-20 pointer-events-none mx-auto max-w-7xl px-6 lg:px-16 w-full flex-1 grid">

          {/* 1. HERO OVERLAY (0 - 25% Scroll) */}
          <div
            className="col-start-1 row-start-1 self-center max-w-3xl lg:max-w-2xl transition-all duration-700 ease-out pr-4 lg:pr-8"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${(1 - heroOpacity) * -30}px)`,
              pointerEvents: heroOpacity > 0.3 ? "auto" : "none",
              visibility: heroOpacity > 0.01 ? "visible" : "hidden",
            }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[92px] font-normal tracking-[-0.035em] leading-[0.98] text-white mb-8">
              <span className="block whitespace-nowrap">Build AI.</span>
              <span className="block whitespace-nowrap">Prove capability.</span>
              <span className="block whitespace-nowrap text-neutral-300 font-normal">Earn globally.</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed max-w-xl mb-10">
              The verified platform connecting experts, delivery pods, autonomous AI agents, and enterprise opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-sm px-8 py-6 rounded-none group transition-all"
              >
                <Link to="/auth/signup">
                  Explore Marketplace
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
                  Tell Us What to Build
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. DISCOVERY OVERLAY (28% - 60% Scroll) */}
          <div
            className="col-start-1 row-start-1 self-center max-w-4xl mx-auto text-center transition-all duration-700 ease-out w-full"
            style={{
              opacity: discoveryOpacity,
              transform: `translateY(${(1 - discoveryOpacity) * 20}px)`,
              pointerEvents: discoveryOpacity > 0.3 ? "auto" : "none",
              visibility: discoveryOpacity > 0.01 ? "visible" : "hidden",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="size-1.5 rounded-full bg-[#15846E]" />
              <span className="text-xs font-mono tracking-[0.25em] text-[#15846E] uppercase">
                DISCOVER CAPABILITY
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.035em] leading-[1.05] text-white mb-6">
              Find proven AI capability<br />
              <span className="text-neutral-400 font-light">for real work.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-xl mx-auto mb-10">
              Browse AI agents, services, experts, and managed delivery pods.
            </p>

            {/* Architectural Line-Separated Navigation (No boxed cards) */}
            <div className="border-y border-neutral-800 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto">
              <Link
                to="/auth/signup"
                className="group flex flex-col justify-between space-y-2 p-2 hover:bg-neutral-900/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#15846E] font-medium tracking-wider">01</span>
                  <Cpu className="size-4 text-neutral-500 group-hover:text-[#10b981] transition-colors" />
                </div>
                <div>
                  <div className="text-white font-mono text-xs font-semibold tracking-wider group-hover:text-[#10b981] transition-colors">AI AGENTS</div>
                  <div className="text-[11px] text-neutral-400 font-light mt-0.5">Autonomous Swarms</div>
                </div>
              </Link>

              <Link
                to="/auth/signup"
                className="group flex flex-col justify-between space-y-2 p-2 hover:bg-neutral-900/40 transition-colors md:border-l md:border-neutral-800/80 md:pl-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#15846E] font-medium tracking-wider">02</span>
                  <Code2 className="size-4 text-neutral-500 group-hover:text-[#10b981] transition-colors" />
                </div>
                <div>
                  <div className="text-white font-mono text-xs font-semibold tracking-wider group-hover:text-[#10b981] transition-colors">SERVICES</div>
                  <div className="text-[11px] text-neutral-400 font-light mt-0.5">RAG & Model Tuning</div>
                </div>
              </Link>

              <Link
                to="/auth/signup"
                className="group flex flex-col justify-between space-y-2 p-2 hover:bg-neutral-900/40 transition-colors md:border-l md:border-neutral-800/80 md:pl-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#15846E] font-medium tracking-wider">03</span>
                  <Users className="size-4 text-neutral-500 group-hover:text-[#10b981] transition-colors" />
                </div>
                <div>
                  <div className="text-white font-mono text-xs font-semibold tracking-wider group-hover:text-[#10b981] transition-colors">EXPERTS</div>
                  <div className="text-[11px] text-neutral-400 font-light mt-0.5">Verified Engineers</div>
                </div>
              </Link>

              <Link
                to="/auth/signup"
                className="group flex flex-col justify-between space-y-2 p-2 hover:bg-neutral-900/40 transition-colors md:border-l md:border-neutral-800/80 md:pl-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#15846E] font-medium tracking-wider">04</span>
                  <Zap className="size-4 text-neutral-500 group-hover:text-[#10b981] transition-colors" />
                </div>
                <div>
                  <div className="text-white font-mono text-xs font-semibold tracking-wider group-hover:text-[#10b981] transition-colors">DELIVERY PODS</div>
                  <div className="text-[11px] text-neutral-400 font-light mt-0.5">Managed AI Teams</div>
                </div>
              </Link>
            </div>
          </div>

          {/* 3. INTAKE TRIGGER OVERLAY (60% - 84% Scroll) */}
          <div
            className="col-start-1 row-start-1 self-center max-w-2xl mx-auto text-center transition-all duration-700 ease-out w-full"
            style={{
              opacity: intakeOpacity,
              transform: `translateY(${(1 - intakeOpacity) * 20}px)`,
              pointerEvents: intakeOpacity > 0.3 ? "auto" : "none",
              visibility: intakeOpacity > 0.01 ? "visible" : "hidden",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="size-1.5 rounded-full bg-[#15846E]" />
              <span className="text-xs font-mono tracking-[0.25em] text-[#15846E] uppercase">
                BUYER INTAKE
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.035em] leading-[1.05] text-white mb-6">
              Tell us what you're<br />
              <span className="text-neutral-400 font-light">trying to build.</span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-xl mx-auto mb-10">
              Describe your problem in natural language. AI5K returns explainable matches with evidence attached.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-xs px-8 py-6 rounded-none group transition-all font-mono tracking-wider"
            >
              <Link to="/auth/signup">
                <Search className="mr-2 size-4 text-black" />
                START INTAKE WIZARD
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* 4. PROOF & EXECUTION OVERLAY (85% - 100% Scroll) */}
          <div
            className="col-start-1 row-start-1 self-center max-w-3xl mx-auto text-center transition-all duration-700 ease-out w-full"
            style={{
              opacity: executionOpacity,
              transform: `translateY(${(1 - executionOpacity) * 20}px)`,
              pointerEvents: executionOpacity > 0.3 ? "auto" : "none",
              visibility: executionOpacity > 0.01 ? "visible" : "hidden",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center">
              <span className="size-1.5 rounded-full bg-[#15846E]" />
              <span className="text-xs font-mono tracking-[0.25em] text-[#15846E] uppercase">
                COMMERCIAL EXECUTION
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[-0.035em] leading-[1.05] text-white mb-6">
              Every claim has proof.<br />
              <span className="text-neutral-400 font-light">From need to engagement.</span>
            </h2>

            <div className="py-4 my-6 border-y border-neutral-800/80 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm font-mono text-neutral-400 tracking-wider">
                Need <span className="text-[#10b981] mx-1">→</span> Match <span className="text-[#10b981] mx-1">→</span> Evidence <span className="text-[#10b981] mx-1">→</span> Proposal <span className="text-[#10b981] mx-1">→</span> Contract <span className="text-[#10b981] mx-1">→</span> Delivery <span className="text-[#10b981] mx-1">→</span> Verified Reputation
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button
                asChild
                size="lg"
                className="bg-[#15846E] hover:bg-[#10b981] text-black font-semibold text-xs px-8 py-6 rounded-none group transition-all font-mono tracking-wider"
              >
                <Link to="/discover">
                  EXPLORE BEFORE LOGIN
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-neutral-800 bg-black/60 hover:bg-neutral-900 text-neutral-300 text-xs px-8 py-6 rounded-none backdrop-blur-md hover:text-white font-mono tracking-wider"
              >
                <Link to="/auth/signup">
                  CREATE ACCOUNT
                </Link>
              </Button>
            </div>
          </div>

        </div>

      </div>
      
    </div>
  );
}
