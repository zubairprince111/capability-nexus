import { createFileRoute } from "@tanstack/react-router";

import { PageTransition } from "@/components/motion/primitives";
import { SectionHeading } from "@/components/system/primitives";
import { assets, opportunities } from "@/lib/mock/data";
import { AssetCard, OpportunityCard } from "@/components/system/entity-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — AI5K" },
      { name: "description", content: "Procure verified capability with evidence attached to every listing." },
      { property: "og:title", content: "Marketplace — AI5K" },
      { property: "og:description", content: "Procure verified capability with evidence attached to every listing." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  return (
    <PageTransition className="space-y-8 pb-12">
      <SectionHeading eyebrow="Marketplace" title="Marketplace" description="Procure verified capability with evidence attached to every listing." />
      
      <Tabs defaultValue="assets" className="space-y-8">
        <TabsList>
          <TabsTrigger value="assets">Verified Assets</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </TabsContent>
        
        <TabsContent value="opportunities" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
