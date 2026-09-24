import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { AdminVerificationQueue } from "@/components/admin/admin-verification-queue";

export const Route = createFileRoute("/app/admin")({
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
