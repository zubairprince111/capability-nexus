import OrgDetailClient from "./OrgDetailClient";

export async function generateStaticParams() {
  return [{ id: "default" }];
}

export default function OrgDetailPage() {
  return <OrgDetailClient />;
}
