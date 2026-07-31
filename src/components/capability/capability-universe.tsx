import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { Tag, VerificationBadge } from "@/components/system/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UniverseGraph, UniverseNode } from "@/lib/types";

type Kind = UniverseNode["kind"];

const KIND_META: Record<Kind, { label: string; color: string; ring: number }> = {
  core: { label: "You", color: "var(--primary)", ring: 0 },
  domain: { label: "Domains", color: "var(--primary)", ring: 1 },
  project: { label: "Projects", color: "var(--signal)", ring: 2 },
  evidence: { label: "Evidence", color: "var(--proof)", ring: 3 },
  organization: { label: "Organisations", color: "var(--verified)", ring: 3 },
  asset: { label: "AI assets", color: "var(--chart-4)", ring: 3 },
  person: { label: "People", color: "var(--chart-5)", ring: 3 },
};

const FILTERS: { value: "all" | Kind; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "domain", label: "Domains" },
  { value: "project", label: "Projects" },
  { value: "evidence", label: "Evidence" },
  { value: "organization", label: "Organisations" },
  { value: "asset", label: "Assets" },
  { value: "person", label: "People" },
];

const SIZE = 900;
const CENTER = SIZE / 2;
const RADII = [0, 170, 285, 390];

interface Placed extends UniverseNode {
  x: number;
  y: number;
  r: number;
}

/**
 * The Capability Universe — AI5K's visual signature.
 *
 * A deterministic, proof-weighted lattice: the closer a node sits to the core
 * and the brighter its link, the stronger the verified relationship. Layout is
 * computed analytically (no physics dependency) so it is stable across renders,
 * SSR-safe, and fully keyboard navigable.
 */
export function CapabilityUniverse({
  graph,
  className,
  compact = false,
}: {
  graph: UniverseGraph;
  className?: string;
  compact?: boolean;
}) {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [activeId, setActiveId] = useState<string>("core");
  const reduced = useReducedMotion();

  const placed = useMemo<Placed[]>(() => {
    const byRing = new Map<number, UniverseNode[]>();
    for (const node of graph.nodes) {
      const ring = KIND_META[node.kind].ring;
      byRing.set(ring, [...(byRing.get(ring) ?? []), node]);
    }

    const angles = new Map<string, number>();
    const result: Placed[] = [];

    const place = (node: UniverseNode, angle: number, ring: number) => {
      const radius = RADII[ring] ?? 390;
      angles.set(node.id, angle);
      result.push({
        ...node,
        x: CENTER + Math.cos(angle) * radius,
        y: CENTER + Math.sin(angle) * radius,
        r: 6 + (node.weight / 100) * (node.kind === "core" ? 22 : 12),
      });
    };

    const core = graph.nodes.find((n) => n.kind === "core");
    if (core) place(core, 0, 0);

    const domains = byRing.get(1) ?? [];
    domains.forEach((node, i) => place(node, (i / domains.length) * Math.PI * 2 - Math.PI / 2, 1));

    const ring2 = byRing.get(2) ?? [];
    ring2.forEach((node, i) => {
      const parentAngle = node.parent ? angles.get(node.parent) : undefined;
      const base = parentAngle ?? (i / Math.max(1, ring2.length)) * Math.PI * 2;
      place(node, base + 0.28, 2);
    });

    const ring3 = byRing.get(3) ?? [];
    ring3.forEach((node, i) => {
      const parentAngle = node.parent ? angles.get(node.parent) : undefined;
      const spread = (i / Math.max(1, ring3.length)) * Math.PI * 2 - Math.PI / 2;
      place(node, parentAngle !== undefined ? parentAngle + 0.16 : spread, 3);
    });

    return result;
  }, [graph]);

  const nodeMap = useMemo(() => new Map(placed.map((n) => [n.id, n])), [placed]);
  const active = nodeMap.get(activeId) ?? placed[0];

  const neighbours = useMemo(() => {
    const set = new Set<string>();
    for (const edge of graph.edges) {
      if (edge.from === activeId) set.add(edge.to);
      if (edge.to === activeId) set.add(edge.from);
    }
    return set;
  }, [graph.edges, activeId]);

  const isDimmed = (node: Placed) =>
    filter !== "all" && node.kind !== filter && node.kind !== "core" && !neighbours.has(node.id);

  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="text-eyebrow">Capability Universe</p>
          <h3 className="mt-1 truncate text-display text-lg">{graph.subject}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "secondary" : "ghost"}
              size="sm"
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="aurora pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={cn("relative w-full", compact ? "max-h-[26rem]" : "max-h-[38rem]")}
          role="group"
          aria-label={`Capability graph for ${graph.subject}`}
        >
          <defs>
            <radialGradient id="universe-core" cx="50%" cy="50%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={200} fill="url(#universe-core)" />
          {RADII.slice(1).map((r) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke="var(--border)"
              strokeDasharray="2 8"
              opacity={0.7}
            />
          ))}

          <g>
            {graph.edges.map((edge, i) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const related = edge.from === activeId || edge.to === activeId;
              const dim = isDimmed(from) || isDimmed(to);
              const mx = (from.x + to.x) / 2 + (CENTER - (from.x + to.x) / 2) * 0.12;
              const my = (from.y + to.y) / 2 + (CENTER - (from.y + to.y) / 2) * 0.12;
              return (
                <motion.path
                  key={`${edge.from}-${edge.to}`}
                  d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                  fill="none"
                  stroke={related ? "var(--primary)" : "var(--foreground)"}
                  strokeWidth={related ? 1.6 : 0.9}
                  strokeLinecap="round"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: dim ? 0.06 : related ? 0.75 : 0.16 + (edge.strength / 100) * 0.14,
                  }}
                  transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.2 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                />
              );
            })}
          </g>

          <g>
            {placed.map((node, i) => {
              const meta = KIND_META[node.kind];
              const dim = isDimmed(node);
              const isActive = node.id === activeId;
              return (
                <motion.g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label} — ${meta.label}, ${node.detail}`}
                  className="cursor-pointer focus:outline-none"
                  onFocus={() => setActiveId(node.id)}
                  onMouseEnter={() => setActiveId(node.id)}
                  onClick={() => setActiveId(node.id)}
                  initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                  animate={{ opacity: dim ? 0.22 : 1, scale: 1 }}
                  transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.1 + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                >
                  {(isActive || node.kind === "core") && (
                    <circle cx={node.x} cy={node.y} r={node.r + 12} fill={meta.color} opacity={0.14} />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={node.kind === "core" ? meta.color : "var(--card)"}
                    stroke={meta.color}
                    strokeWidth={isActive ? 2.4 : 1.4}
                  />
                  <text
                    x={node.x}
                    y={node.y + node.r + 16}
                    textAnchor="middle"
                    className="fill-foreground text-[13px]"
                    style={{ fontFamily: "var(--font-mono)", opacity: dim ? 0.3 : 0.82 }}
                  >
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </g>
        </svg>

        {active && (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs">
            <div className="surface-card bg-popover/95 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <p className="text-eyebrow">{KIND_META[active.kind].label}</p>
                <VerificationBadge level={active.level} />
              </div>
              <h4 className="mt-2 text-display text-lg">{active.label}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{active.detail}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag>Weight {active.weight}</Tag>
                <Tag>{neighbours.size} connections</Tag>
              </div>
            </div>
          </div>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-5 py-3">
        {(Object.keys(KIND_META) as Kind[]).map((kind) => (
          <li key={kind} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: KIND_META[kind].color }} aria-hidden />
            {KIND_META[kind].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
