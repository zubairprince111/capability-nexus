import type { ListQuery, Paginated } from "../types";

/**
 * Mock transport.
 *
 * The only module in the app that knows data is local. Swap the body of
 * `request` for `fetch(`${BASE_URL}${path}`)` and every repository, hook and
 * screen keeps working unchanged.
 */

const LATENCY_MS = 320;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(resolve: () => T, options?: { latency?: number }): Promise<T> {
  await new Promise((r) => setTimeout(r, options?.latency ?? LATENCY_MS));
  const value = resolve();
  if (value === undefined) throw new ApiError("Resource not found", 404);
  return value;
}

function matches(value: unknown, needle: string): boolean {
  if (value == null) return false;
  if (typeof value === "string" || typeof value === "number") {
    return String(value).toLowerCase().includes(needle);
  }
  if (Array.isArray(value)) return value.some((v) => matches(v, needle));
  return false;
}

/** Client-side stand-in for server search/sort/filter/pagination semantics. */
export function paginate<T>(
  source: readonly T[],
  query: ListQuery = {},
  config: { searchKeys: (keyof T)[]; sorters?: Record<string, (a: T, b: T) => number> } = {
    searchKeys: [],
  },
): Paginated<T> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = query.pageSize ?? 12;
  let rows = [...source];

  const needle = query.search?.trim().toLowerCase();
  if (needle) {
    rows = rows.filter((row) => config.searchKeys.some((key) => matches(row[key], needle)));
  }

  const filters = query.filters ?? {};
  for (const [key, value] of Object.entries(filters)) {
    if (!value || value === "all") continue;
    rows = rows.filter((row) => {
      const field = row[key as keyof T];
      if (Array.isArray(field)) return field.map(String).includes(value);
      return String(field) === value;
    });
  }

  const sorter = query.sort ? config.sorters?.[query.sort] : undefined;
  if (sorter) rows.sort(sorter);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);

  return { items, total, page, pageSize, hasMore: start + items.length < total };
}
