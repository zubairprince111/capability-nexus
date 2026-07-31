import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { StatusDot } from "@/components/system/primitives";
import { worldPresence } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

/**
 * World capability field — an abstract projection of where verified capability
 * concentrates. Deliberately not a literal map: AI5K plots proof density, not
 * borders.
 */
export function WorldCapabilityField({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(worldPresence[0]!.id);

  const dots = useMemo(() => {
    const points: { x: number; y: number; o: number }[] = [];
    for (let row = 0; row < 26; row++) {
      for (let col = 0; col < 52; col++) {
        const x = (col / 51) * 100;
        const y = (row / 25) * 100;
        const dx = (x - 50) / 50;
        const dy = (y - 50) / 50;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 1) continue;
        points.push({ x, y, o: 0.06 + (1 - d) * 0.16 });
      }
    }
    return points;
  }, []);

  const activeCity = worldPresence.find((c) => c.id === active) ?? worldPresence[0]!;

  return (
    <div className={cn("surface-card relative overflow-hidden", className)}>
      <div className="aurora pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-eyebrow">Global capability field</p>
            <h3 className="mt-1 text-display text-xl">Proof density by region</h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-eyebrow">{activeCity.city}</p>
            <p className="text-data mt-1 text-lg font-semibold">
              {activeCity.professionals.toLocaleString()}
            </p>
          </div>
        </div>

        <svg viewBox="0 0 100 100" className="mt-4 w-full" role="img" aria-label="Verified capability by city">
          {dots.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r={0.35} fill="var(--foreground)" opacity={dot.o} />
          ))}

          {worldPresence.map((city) => (
            <g key={city.id}>
              <motion.line
                x1={50}
                y1={50}
                x2={city.x}
                y2={city.y}
                stroke="var(--primary)"
                strokeWidth={0.18}
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: city.id === active ? 0.7 : 0.18 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.circle
                cx={city.x}
                cy={city.y}
                r={city.id === active ? 1.5 : 1}
                fill="var(--primary)"
                tabIndex={0}
                role="button"
                aria-label={`${city.city}: ${city.professionals.toLocaleString()} verified professionals`}
                className="cursor-pointer focus:outline-none"
                onMouseEnter={() => setActive(city.id)}
                onFocus={() => setActive(city.id)}
                animate={{ opacity: city.id === active ? 1 : 0.7 }}
              />
              {city.id === active && (
                <circle cx={city.x} cy={city.y} r={3.4} fill="var(--primary)" opacity={0.14} />
              )}
            </g>
          ))}
        </svg>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
          {["Africa", "Americas", "Asia Pacific", "Europe"].map((region) => (
            <li key={region} className="flex items-center gap-2 text-xs text-muted-foreground">
              <StatusDot tone="signal" />
              {region}
              <span className="text-data text-foreground">
                {worldPresence
                  .filter((c) => c.region === region)
                  .reduce((sum, c) => sum + c.professionals, 0)
                  .toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
