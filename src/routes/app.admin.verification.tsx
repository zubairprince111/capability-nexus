import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { AdminVerificationQueue } from "@/components/admin/admin-verification-queue";
import { hasAdminAccess } from "@/lib/services/ai5k-service";

export const Route = createFileRoute("/app/admin/verification")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      if (!hasAdminAccess()) {
        throw redirect({ to: "/app" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Verification Queue — AI5K Network Governance" },
      { name: "description", content: "Audit evidence artifacts and manage attestation claims." },
      { property: "og:title", content: "Verification Queue — AI5K Network Governance" },
      { property: "og:description", content: "Audit evidence artifacts and manage attestation claims." },
    ],
  }),
  component: AdminVerificationRoute,
});

function AdminVerificationRoute() {
  return (
    <PageTransition>
      <AdminVerificationQueue />
    </PageTransition>
  );
}
