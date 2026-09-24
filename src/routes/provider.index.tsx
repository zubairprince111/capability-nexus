import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquare, Plus, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/provider/")({
  component: ProviderOverview,
});

const METRICS = [
  {
    label: "Total Earnings",
    value: "$42,850",
    trend: "+12.5%",
    trendLabel: "all time",
    positive: true,
  },
  {
    label: "This Month",
    value: "$8,240",
    trend: "+4.2%",
    trendLabel: "vs last",
    positive: true,
  },
  {
    label: "Active Tools",
    value: "14",
    trend: "Stable",
    trendLabel: "",
    positive: null,
  },
  {
    label: "Total Sales",
    value: "1,204",
    trend: "+18%",
    trendLabel: "",
    positive: true,
  },
];

const PERFORMANCE = [
  {
    name: "Data Extractor Pro",
    version: "v2.1.0",
    updated: "Updated 2d ago",
    status: "Published",
    sales: 482,
    revenue: "$14,460",
    rating: 4.9,
  },
  {
    name: "Sentiment Analyzer",
    version: "v1.8.4",
    updated: "Updated 1w ago",
    status: "Pending",
    sales: "--",
    revenue: "--",
    rating: null,
  },
  {
    name: "Code Refactor Bot",
    version: "v3.2.1",
    updated: "Updated 2mo ago",
    status: "Published",
    sales: 722,
    revenue: "$21,660",
    rating: 4.7,
  },
];

const ACTIVITY = [
  {
    type: "sale",
    title: "New Sale! Data Extractor Pro",
    time: "2 mins ago",
    details: "$30.00",
    icon: ShoppingCart,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    type: "review",
    title: "Review Approved",
    time: "1 hr ago",
    details: "Admin approved 'Sentiment Analyzer' v1.8.4. It is now live.",
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    type: "sale",
    title: "New Sale! Code Refactor Bot",
    time: "3 hrs ago",
    details: "$30.00",
    icon: ShoppingCart,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    type: "warning",
    title: "API Limit Warning",
    time: "Yesterday",
    details: "Your test environment is nearing its daily limit.",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

function ProviderOverview() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your ecosystem performance, recent sales, and tool analytics in real-time.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-border bg-surface p-5">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      metric.positive === true
                        ? "bg-primary/10 text-primary"
                        : metric.positive === false
                          ? "bg-destructive/10 text-destructive"
                          : "bg-surface-foreground/10 text-muted-foreground"
                    }`}
                  >
                    {metric.positive && <TrendingUp className="mr-1 size-3" />}
                    {metric.trend}
                  </span>
                  {metric.trendLabel && <span className="text-xs text-muted-foreground">{metric.trendLabel}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Performance Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tool Performance</h2>
              <Link to="/app/marketplace" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-foreground/5">
                    <th className="px-6 py-4 font-mono font-medium text-muted-foreground">Tool Name</th>
                    <th className="px-6 py-4 font-mono font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 font-mono font-medium text-muted-foreground text-right">Sales</th>
                    <th className="px-6 py-4 font-mono font-medium text-muted-foreground text-right">Revenue</th>
                    <th className="px-6 py-4 font-mono font-medium text-muted-foreground text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PERFORMANCE.map((item) => (
                    <tr key={item.name} className="hover:bg-surface-foreground/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded bg-primary/20" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{item.version} · {item.updated}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider ${
                          item.status === "Published" ? "bg-primary/10 text-primary border border-primary/20" : "bg-surface-foreground/10 text-muted-foreground border border-border"
                        }`}>
                          <span className={`mr-1.5 size-1.5 rounded-full ${item.status === "Published" ? "bg-primary" : "bg-muted-foreground"}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">{item.sales}</td>
                      <td className="px-6 py-4 text-right font-mono">{item.revenue}</td>
                      <td className="px-6 py-4 text-right font-mono">
                        {item.rating ? (
                          <span className="flex items-center justify-end gap-1 text-yellow-500">
                            {item.rating} <span className="text-lg leading-none">★</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-- ☆</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
          <Link to="/provider/create-service" className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center transition-all hover:border-primary/60 hover:bg-primary/10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]">
              <Plus className="size-6" />
            </div>
            <div className="relative mt-2">
              <p className="font-semibold text-foreground">Add New Tool</p>
              <p className="text-sm font-mono text-muted-foreground">Launch to marketplace</p>
            </div>
          </Link>

          <div className="rounded-xl border border-border bg-surface flex flex-col h-[500px]">
            <div className="border-b border-border p-5">
              <h3 className="font-medium flex items-center gap-2">
                <BellIcon className="size-4" /> Recent Activity
              </h3>
            </div>
            <div className="flex-1 overflow-auto p-5 space-y-6">
              {ACTIVITY.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${act.bg} ${act.color}`}>
                    <act.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{act.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{act.details}</p>
                    <p className="mt-2 font-mono text-[0.625rem] text-muted-foreground">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4 text-center">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Mark all as read
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function BellIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
