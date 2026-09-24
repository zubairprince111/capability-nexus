import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { ArrowRight, ShieldCheck, Sparkles, Globe, Award, Network } from "lucide-react";

export const Route = createFileRoute("/manifesto")({
  head: () => ({
    meta: [
      { title: "Manifesto — AI5K" },
      { name: "description", content: "AI5K Manifesto: Capability is easy to claim. Proof is harder." },
    ],
  }),
  component: Manifesto,
});

export function Manifesto() {
  return (
    <div className="min-h-dvh bg-black text-white selection:bg-[#15846E]/30 selection:text-white flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#15846E]/10 blur-[150px] rounded-full pointer-events-none" />
      
      <SiteHeader />

      <main className="flex-1 py-20 sm:py-28 relative z-10">
        <PageTransition className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Hero Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15846E]/15 border border-[#15846E]/30 text-[#10b981] font-mono text-xs tracking-wider uppercase">
              <Sparkles className="size-3.5" />
              <span>The AI5K Vision</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold text-white tracking-tight">
              Manifesto
            </h1>
            
            <p className="text-2xl sm:text-3xl text-neutral-200 font-light leading-snug max-w-2xl mx-auto">
              Capability is easy to claim. <span className="text-[#10b981] font-normal">Proof is harder.</span>
            </p>
          </div>

          {/* Main Statement Cards */}
          <div className="space-y-8 text-neutral-300 font-light text-lg sm:text-xl leading-relaxed mb-16">
            
            <div className="p-8 rounded-2xl bg-neutral-900/40 border border-white/10 backdrop-blur-md">
              <p className="text-white font-normal text-xl sm:text-2xl leading-relaxed">
                AI5K exists to make AI capability easier to discover, verify, and put to work.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/20 border border-white/5 space-y-6">
              <p>
                The world does not need another directory of people who say they can build with AI. 
                It needs a trusted way to understand who can actually deliver, what they have built, 
                and where their expertise applies.
              </p>
              <p className="text-white font-medium text-xl border-l-2 border-[#10b981] pl-4 py-1">
                We believe capability should be backed by evidence.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Projects", "Outcomes", "Assessments", "Certifications", "References", "Verified Experience"].map((pill) => (
                  <span key={pill} className="px-3 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-xs font-mono text-neutral-300">
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid of Key Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="p-6 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
                <Network className="size-6 text-[#10b981]" />
                <h3 className="text-white font-medium text-lg">Living Network</h3>
                <p className="text-sm text-neutral-400">
                  AI5K brings these signals together into a living capability network connecting people, organizations, services, and AI systems.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
                <Globe className="size-6 text-[#10b981]" />
                <h3 className="text-white font-medium text-lg">Borderless Potential</h3>
                <p className="text-sm text-neutral-400">
                  We are building a network where strong capability can travel beyond geography, credentials, and traditional hiring boundaries.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
                <ShieldCheck className="size-6 text-[#10b981]" />
                <h3 className="text-white font-medium text-lg">Instant Verification</h3>
                <p className="text-sm text-neutral-400">
                  Where organizations can find the right expertise without searching endlessly, backed by cryptographic proof.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
                <Award className="size-6 text-[#10b981]" />
                <h3 className="text-white font-medium text-lg">Demonstrated Proof</h3>
                <p className="text-sm text-neutral-400">
                  Where professionals can demonstrate what they can actually do, and AI systems can be engaged with greater confidence.
                </p>
              </div>
            </div>

            <div className="text-center py-6">
              <p className="text-[#10b981] font-mono font-medium text-xl sm:text-2xl tracking-wide">
                Build AI. Prove capability. Earn globally.
              </p>
            </div>

          </div>

          {/* Action CTA Box with Sign In and Create Account Buttons */}
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-neutral-900/80 to-black border border-[#10b981]/30 text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -right-16 -top-16 size-48 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl font-normal text-white">
              Ready to verify your capability?
            </h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto font-light">
              Join the verified AI network today. Demonstrate what you build and unlock global opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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
