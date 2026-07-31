import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterDefinition {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

/**
 * Server-ready list toolbar. Emits a normalised `ListQuery` shape so the same
 * component drives every collection screen (and later, real endpoints).
 */
export function CollectionToolbar({
  search,
  onSearch,
  filters = [],
  filterValues = {},
  onFilter,
  sortOptions = [],
  sort,
  onSort,
  total,
  className,
}: {
  search: string;
  onSearch: (value: string) => void;
  filters?: FilterDefinition[];
  filterValues?: Record<string, string | undefined>;
  onFilter?: (key: string, value: string) => void;
  sortOptions?: { value: string; label: string }[];
  sort?: string;
  onSort?: (value: string) => void;
  total?: number;
  className?: string;
}) {
  const activeFilters = Object.entries(filterValues).filter(([, v]) => v && v !== "all");

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name, domain, organisation or evidence…"
            aria-label="Search collection"
            className="h-11 pl-9"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] ?? "all"}
              onValueChange={(value) => onFilter?.(filter.key, value)}
            >
              <SelectTrigger className="h-11 min-w-[9.5rem]" aria-label={filter.label}>
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
                {filter.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {sortOptions.length > 0 && (
            <Select value={sort ?? sortOptions[0]?.value} onValueChange={(v) => onSort?.(v)}>
              <SelectTrigger className="h-11 min-w-[10rem]" aria-label="Sort">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {typeof total === "number" && (
          <span className="text-data">
            {total} result{total === 1 ? "" : "s"}
          </span>
        )}
        {activeFilters.map(([key, value]) => (
          <Button
            key={key}
            variant="secondary"
            size="sm"
            className="h-7 rounded-full px-3 text-xs"
            onClick={() => onFilter?.(key, "all")}
          >
            {value}
            <X className="ml-1 size-3" />
          </Button>
        ))}
      </div>
    </div>
  );
}
