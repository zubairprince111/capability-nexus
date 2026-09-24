import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site/site-chrome";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — AI5K" },
      { name: "description", content: "Terms of Use for AI5K." },
    ],
  }),
  component: Terms,
});

export function Terms() {
  const SECTIONS = [
    {
      num: "01",
      title: "Platform Use",
      content: [
        "You may use AI5K to discover capabilities, create or manage profiles, explore services, submit opportunities, request proposals, and engage with participating professionals or organizations.",
        "You agree not to misuse the platform, provide intentionally misleading information, impersonate another person or organization, or interfere with the operation of the platform."
      ]
    },
    {
      num: "02",
      title: "Profiles and Information",
      content: [
        "Users are responsible for the accuracy of information they provide.",
        "AI5K may distinguish between different forms of evidence, including self-declared information, assessed capability, demonstrated project experience, client verification, certifications, and other supporting evidence.",
        "Verification does not constitute a guarantee of future performance."
      ]
    },
    {
      num: "03",
      title: "Engagements",
      content: [
        "AI5K may facilitate introductions, proposals, assessments, and commercial engagements between parties.",
        "The specific terms of an engagement may be governed by a separate agreement between the participating parties."
      ]
    },
    {
      num: "04",
      title: "Content & Ownership",
      content: [
        "Users retain responsibility for content they submit to AI5K and must have the necessary rights to provide that content.",
        "You may not submit content that violates applicable law or the rights of others."
      ]
    },
    {
      num: "05",
      title: "Platform Evolution",
      content: [
        "AI5K may modify, suspend, or discontinue features of the platform as it develops and scales."
      ]
    },
    {
      num: "06",
      title: "Disclaimer",
      content: [
        "AI5K provides a capability discovery and connection platform. Information presented on the platform should be evaluated in context, and users remain responsible for their own commercial decisions and engagements."
      ]
    }
  ];

  return (
    <div className="min-h-dvh bg-black text-white selection:bg-[#15846E]/30 selection:text-white flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#15846E]/10 blur-[140px] rounded-full pointer-events-none" />

      <SiteHeader variant="minimal" />

      <main className="flex-1 py-20 sm:py-28 relative z-10">
        <PageTransition className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Terms of Use
            </h1>
            <p className="text-lg text-neutral-400 font-light max-w-2xl">
              Welcome to AI5K. These terms outline the rules and guidelines governing the capability verification network.
            </p>
          </div>

          {/* Section List */}
          <div className="space-y-8 mb-16">
            {SECTIONS.map((sec) => (
              <div key={sec.num} className="p-8 rounded-2xl bg-neutral-950/70 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#15846E]/20 border border-[#15846E]/40 text-[#10b981]">
                    {sec.num}
                  </span>
                  <h2 className="text-xl font-medium text-white tracking-wide">{sec.title}</h2>
                </div>

                <div className="space-y-3 text-neutral-300 font-light leading-relaxed text-sm sm:text-base">
                  {sec.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action CTA Box */}
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-neutral-900/80 to-black border border-[#10b981]/30 text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -right-16 -top-16 size-48 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center justify-center size-12 rounded-xl bg-[#15846E]/20 border border-[#10b981]/40 text-[#10b981] mb-2 mx-auto">
              <ShieldCheck className="size-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-normal text-white">
              Ready to explore the platform?
            </h2>
            <p className="text-neutral-400 text-sm max-w-md mx-auto font-light">
              Create an account or sign in to start proving and discovering AI capability.
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
