import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Boxes,
  Building2,
  FileCheck2,
  Moon,
  Orbit,
  Settings,
  Sun,
  Target,
  Users,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { opportunitiesQuery, organizationsQuery, professionalsQuery } from "@/lib/queries";
import { useTheme } from "@/lib/theme";

/**
 * Global command palette — the primary navigation surface for power users.
 * Data comes from the same repositories as every screen, so it stays truthful
 * once real endpoints are connected.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { data: people } = useQuery({ ...professionalsQuery({ pageSize: 5, sort: "index" }), enabled: open });
  const { data: orgs } = useQuery({ ...organizationsQuery({ pageSize: 4, sort: "trust" }), enabled: open });
  const { data: roles } = useQuery({ ...opportunitiesQuery({ pageSize: 4, sort: "match" }), enabled: open });

  const go = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search people, organisations, opportunities or actions…" />
      <CommandList className="max-h-[26rem]">
        <CommandEmpty>No matches. Every result here is evidence-backed.</CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go(() => navigate({ to: "/app" }))}>
            <Target className="size-4" />
            Mission Control
            <CommandShortcut>G M</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/universe" }))}>
            <Orbit className="size-4" />
            Capability Universe
            <CommandShortcut>G U</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/opportunities" }))}>
            <FileCheck2 className="size-4" />
            Opportunities
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/assets" }))}>
            <Boxes className="size-4" />
            AI assets
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/settings" }))}>
            <Settings className="size-4" />
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Professionals">
          {(people?.items ?? []).map((person) => (
            <CommandItem
              key={person.id}
              value={`${person.name} ${person.title}`}
              onSelect={() =>
                go(() => navigate({ to: "/app/professionals/$handle", params: { handle: person.handle } }))
              }
            >
              <Users className="size-4" />
              <span className="truncate">{person.name}</span>
              <span className="text-data ml-auto text-xs text-muted-foreground">{person.capabilityIndex}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Organisations">
          {(orgs?.items ?? []).map((org) => (
            <CommandItem
              key={org.id}
              value={org.name}
              onSelect={() => go(() => navigate({ to: "/app/organizations/$slug", params: { slug: org.slug } }))}
            >
              <Building2 className="size-4" />
              <span className="truncate">{org.name}</span>
              <span className="text-data ml-auto text-xs text-muted-foreground">{org.trustIndex}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Opportunities">
          {(roles?.items ?? []).map((role) => (
            <CommandItem
              key={role.id}
              value={`${role.title} ${role.organization}`}
              onSelect={() => go(() => navigate({ to: "/app/opportunities/$id", params: { id: role.id } }))}
            >
              <ArrowRight className="size-4" />
              <span className="truncate">{role.title}</span>
              <span className="text-data ml-auto text-xs text-muted-foreground">{role.matchScore}%</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go(toggle)}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
