import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldCheck, KeyRound } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI5K" },
      { name: "description", content: "Account settings, identity, and session controls." },
      { property: "og:title", content: "Settings — AI5K" },
      { property: "og:description", content: "Account settings, identity, and session controls." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const userName = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_name") : null) || "Ada Lovelace";
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_email") : null) || "ada.lovelace@ai5k.network";
  const userHandle = (typeof window !== "undefined" ? localStorage.getItem("ai5k_user_handle") : null) || "adalovelace";

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai5k_user_name");
      localStorage.removeItem("ai5k_user_email");
      localStorage.removeItem("ai5k_user_handle");
      localStorage.removeItem("ai5k_user_role");
      localStorage.removeItem("ai5k_user_bio");
      window.location.href = "/";
    }
  };

  return (
    <PageTransition className="space-y-8 max-w-4xl mx-auto pb-16">
      <SectionHeading eyebrow="Account & System" title="Account Settings" description="Manage your identity, cryptographic evidence preferences, and active session." />

      {/* Account Info Box */}
      <div className="surface-card p-6 border border-border/80 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 grid place-items-center">
            <User className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">{userName}</h2>
            <p className="text-xs font-mono text-muted-foreground">@{userHandle} · {userEmail}</p>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Session Active
          </span>
        </div>
      </div>

      {/* Security & Sign Out Section */}
      <div className="surface-card p-6 border border-border/80 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-base font-medium text-foreground flex items-center gap-2">
              <KeyRound className="size-4 text-emerald-400" />
              Session & Security
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              End your active platform session across devices.
            </p>
          </div>

          <Button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs gap-2 px-5"
          >
            <LogOut className="size-4" />
            Sign Out / Log Out
          </Button>
        </div>

        <div className="text-xs font-mono text-muted-foreground space-y-1">
          <p>• Multi-Factor Authentication: Enabled (Hardware Key / WebAuthn)</p>
          <p>• Active Keypair: Ed25519 Cryptographic Proof Signature</p>
        </div>
      </div>
    </PageTransition>
  );
}
