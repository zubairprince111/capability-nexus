import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/motion/primitives";
import { AdminVerificationQueue } from "@/components/admin/admin-verification-queue";

export const Route = createFileRoute("/app/admin/verification")({
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
