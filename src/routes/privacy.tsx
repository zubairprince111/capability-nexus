import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { ArrowRight, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AI5K" },
      { name: "description", content: "Privacy Policy for AI5K." },
    ],
  }),
  component: Privacy,
});

export function Privacy() {
  const COLLECTED_ITEMS = [
    "Name & professional details",
    "Contact information",
    "Specializations & expertise",
    "Verified projects & portfolio",
    "Certifications & assessments",
    "Services & capabilities",
    "References & proof signals"
  ];

  const USAGE_ITEMS = [
    "Verify & represent professional capability",
    "Match skills with enterprise opportunities",
    "Facilitate secure introductions & engagements",
    "Maintain platform cryptographic integrity",
    "Comply with global legal standards"
  ];

  return (
    <div className="min-h-dvh bg-black text-white selection:bg-[#15846E]/30 selection:text-white flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#15846E]/10 blur-[140px] rounded-full pointer-events-none" />

      <SiteHeader />

      <main className="flex-1 py-20 sm:py-28 relative z-10">
        <PageTransition className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15846E]/15 border border-[#15846E]/30 text-[#10b981] font-mono text-xs tracking-wider uppercase">
              <Lock className="size-3.5" />
              <span>Data Protection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-neutral-400 font-light max-w-2xl">
              AI5K is built around capability and evidence. We handle the data establishing that capability with strict security and transparency.
            </p>
          </div>

          {/* Section List */}
          <div className="space-y-8 mb-16">
            
            {/* 1. Information Collection */}
            <div className="p-8 rounded-2xl bg-neutral-950/70 border border-white/10 backdrop-blur-md">
              <h2 className="text-xl font-medium text-white mb-4 tracking-wide flex items-center gap-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#15846E]/20 border border-[#15846E]/40 text-[#10b981]">01</span>
                Information We Collect
              </h2>
              <p className="text-neutral-300 font-light mb-6 text-sm sm:text-base leading-relaxed">
                Depending on how you use AI5K, collected information may include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLLECTED_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900/50 border border-white/5 text-sm text-neutral-300 font-light">
                    <CheckCircle2 className="size-4 text-[#10b981] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Usage */}
            <div className="p-8 rounded-2xl bg-neutral-950/70 border border-white/10 backdrop-blur-md">
              <h2 className="text-xl font-medium text-white mb-4 tracking-wide flex items-center gap-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#15846E]/20 border border-[#15846E]/40 text-[#10b981]">02</span>
                How We Use Information
              </h2>
              <div className="space-y-3">
                {USAGE_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm sm:text-base text-neutral-300 font-light">
                    <span className="size-1.5 rounded-full bg-[#10b981]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Public Information & Integrity */}
            <div className="p-8 rounded-2xl bg-neutral-950/70 border border-white/10 backdrop-blur-md space-y-4">
              <h2 className="text-xl font-medium text-white tracking-wide flex items-center gap-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#15846E]/20 border border-[#15846E]/40 text-[#10b981]">03</span>
                Public Capability Profiles & Data Respect
              </h2>
              <p className="text-neutral-300 font-light leading-relaxed text-sm sm:text-base">
                Some profile information may be displayed publicly when a user or organization chooses to create a public capability profile.
              </p>
              <div className="p-4 rounded-xl bg-[#15846E]/10 border border-[#15846E]/30 text-[#10b981] text-sm font-medium">
                AI5K does not treat user data as a commodity. We never sell your personal or capability information to third parties.
              </div>
            </div>

            {/* 4. Security */}
            <div className="p-8 rounded-2xl bg-neutral-950/70 border border-white/10 backdrop-blur-md space-y-4">
              <h2 className="text-xl font-medium text-white tracking-wide flex items-center gap-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#15846E]/20 border border-[#15846E]/40 text-[#10b981]">04</span>
                Security & Encryption
              </h2>
              <p className="text-neutral-300 font-light leading-relaxed text-sm sm:text-base">
                AI5K implements state-of-the-art cryptographic proofs, encryption at rest, and strict access controls to safeguard your data from unauthorized access or alteration.
              </p>
            </div>

          </div>

          {/* Bottom Action CTA Box */}
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-neutral-900/80 to-black border border-[#10b981]/30 text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -right-16 -top-16 size-48 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center justify-center size-12 rounded-xl bg-[#15846E]/20 border border-[#10b981]/40 text-[#10b981] mb-2 mx-auto">
              <ShieldCheck className="size-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-normal text-white">
              Ready to verify your AI capability?
            </h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto font-light">
              Create an account or sign in to build your verified capability profile.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 bg-[#15846E] hover:bg-[#10b981] text-black font-semibold rounded-none group transition-all text-sm tracking-wide">
                <Link to="/auth/signup">
                  Create account
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-neutral-800 hover:border-neutral-600 bg-black text-white hover:text-white rounded-none text-sm tracking-wide">
                <Link to="/auth/login">
                  Sign in
                </Link>
              </Button>
            </div>
          </div>

        </PageTransition>
      </main>

      <SiteFooter />
    </div>
  );
}
