import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PageTransition } from "@/components/motion/primitives";
import { CollectionToolbar } from "@/components/system/collection-toolbar";
import { ProfessionalCard } from "@/components/system/entity-cards";
import { EmptyState } from "@/components/system/primitives";
import { professionalsQuery } from "@/lib/queries";

export const Route = createFileRoute("/app/professionals/")({
  head: () => ({
    meta: [
      { title: "Verified professionals — AI5K" },
      { name: "description", content: "Search AI professionals by verified capability, evidence level and domain." },
      { property: "og:title", content: "Verified professionals — AI5K" },
      { property: "og:description", content: "Search by verified capability, evidence level and domain." },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(professionalsQuery({}));
  },
  component: ProfessionalsPage,
});

function ProfessionalsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("index");
  const { data } = useSuspenseQuery(professionalsQuery({ search, sort }));

  return (
    <PageTransition className="space-y-8">
      <div>
        <p className="text-eyebrow">Directory</p>
        <h1 className="text-display mt-2 text-3xl sm:text-4xl">Verified professionals</h1>
      </div>

      <CollectionToolbar
        search={search}
        onSearch={setSearch}
        sort={sort}
        onSort={setSort}
        sortOptions={[
          { value: "index", label: "Capability index" },
          { value: "recent", label: "Recently attested" },
        ]}
        total={data.total}
      />

      {data.items.length === 0 ? (
        <EmptyState title="No matches" description="Adjust your search to widen the evidence set." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((person) => (
            <ProfessionalCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
