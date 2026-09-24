import { createFileRoute, redirect } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { AdminVerificationQueue } from "@/components/admin/admin-verification-queue";
import { hasAdminAccess } from "@/lib/services/ai5k-service";

export const Route = createFileRoute("/app/admin")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      if (!hasAdminAccess()) {
        throw redirect({ to: "/app" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Admin & Operations — AI5K Network Governance" },
      { name: "description", content: "Evidence review, proof verification, and registry governance." },
      { property: "og:title", content: "Admin & Operations — AI5K Network Governance" },
      { property: "og:description", content: "Evidence review, proof verification, and registry governance." },
    ],
  }),
  component: Admin,
});

function Admin() {
  return (
    <PageTransition>
      <AdminVerificationQueue />
    </PageTransition>
  );
}
