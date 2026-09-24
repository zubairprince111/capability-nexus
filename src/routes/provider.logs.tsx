import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter, Search, Image as ImageIcon, FileText, AlertCircle, RefreshCcw } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/provider/logs")({
  component: ProviderLogs,
});

interface TraceItem {
  step: string;
  time: string;
  error?: boolean;
}

interface LogEntry {
  id: string;
  tool: string;
  time: string;
  status: "Success" | "Failed";
  error?: string;
  duration: string;
  icon: typeof ImageIcon;
  inputs: Record<string, unknown>;
  trace: TraceItem[];
}

const LOGS: LogEntry[] = [
  {
    id: "#REQ-8829",
    tool: "Image Generator Pro",
    time: "10:42 AM",
    status: "Success",
    duration: "2.4s execution",
    icon: ImageIcon,
    inputs: {
      prompt: "A futuristic cityscape at sunset",
      style: "Cyberpunk",
      resolution: "1024x1024",
    },
    trace: [
      { step: "Init process...", time: "0ms" },
      { step: "Validate schema...", time: "15ms" },
      { step: "Generate image...", time: "2350ms" },
      { step: "Process terminated.", time: "2400ms" },
    ],
  },
  {
    id: "#REQ-8828",
    tool: "Data Scraper API",
    time: "09:15 AM",
    status: "Failed",
    error: "ConnectionTimeout: Target server failed to respond within the allocated 30000ms timeframe at node execution stage 2.",
    duration: "Timeout (30s)",
    icon: AlertCircle,
    inputs: {
      target_url: "https://api.example.com/v1/data",
      method: "POST",
      headers: {
        Authorization: "Bearer ***",
        "Content-Type": "application/json"
      },
      payload: {
        query: "financial_records",
        limit: 500
      }
    },
    trace: [
      { step: "Init process...", time: "0ms" },
      { step: "Validate schema...", time: "12ms" },
      { step: "Await response...", time: "30000ms", error: true },
      { step: "Process terminated.", time: "" },
    ],
  },
  {
    id: "#REQ-8827",
    tool: "Text Summarizer V2",
    time: "08:30 AM",
    status: "Success",
    duration: "1.1s execution",
    icon: FileText,
    inputs: {
      source_text: "The quick brown fox jumps over the lazy dog...",
      length: "short",
    },
    trace: [
      { step: "Init process...", time: "0ms" },
      { step: "Validate schema...", time: "10ms" },
      { step: "Generate summary...", time: "1050ms" },
      { step: "Process terminated.", time: "1100ms" },
    ],
  },
];

function ProviderLogs() {
  return (
    <div className="flex h-[calc(100dvh-4rem)]">
      {/* Sidebar Filters */}
      <div className="w-72 border-r border-border bg-surface p-6">
        <h3 className="mb-6 flex items-center gap-2 font-medium">
          <Filter className="size-4" /> Filter Logs
        </h3>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-mono text-muted-foreground">Automation Tool</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono text-muted-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary border border-primary/30">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary" /> All
              </button>
              <button className="rounded-full bg-surface-foreground/5 border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-foreground/10">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary" /> Success
              </button>
              <button className="rounded-full bg-surface-foreground/5 border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-foreground/10">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-destructive" /> Failed
              </button>
              <button className="rounded-full bg-surface-foreground/5 border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-foreground/10">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-yellow-500" /> Running
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono text-muted-foreground">Time Range</label>
            <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <button className="mt-4 text-xs font-medium text-primary hover:underline">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        <div className="flex items-center justify-between border-b border-border bg-background px-8 py-4">
          <div>
            <h2 className="text-lg font-semibold">Run History</h2>
            <p className="text-sm text-muted-foreground">Review and debug past automation executions.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
            <Download className="size-3" /> Export CSV
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {LOGS.map((log) => (
              <AccordionItem key={log.id} value={log.id} className="rounded-xl border border-border bg-surface px-6 overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${log.status === "Success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                        <log.icon className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">{log.tool}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {log.time} · ID: {log.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm ${log.status === "Success" ? "text-primary" : "text-destructive"}`}>
                        {log.status}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{log.duration}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border-t border-border pt-6 pb-2">
                    
                    {log.error && (
                      <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="size-4 shrink-0 mt-0.5" />
                          <p className="font-mono">Error: {log.error}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div>
                        <h4 className="mb-3 text-[0.625rem] font-mono font-bold tracking-widest text-muted-foreground uppercase">Input Parameters</h4>
                        <div className="rounded-lg border border-border bg-background p-4 overflow-auto max-h-[300px]">
                          <pre className="font-mono text-xs text-primary/80">
                            {JSON.stringify(log.inputs, null, 2)}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="mb-3 text-[0.625rem] font-mono font-bold tracking-widest text-muted-foreground uppercase">Execution Trace</h4>
                        <div className="space-y-3 font-mono text-xs">
                          {log.trace.map((t, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="flex items-center gap-2">
                                <span className={`size-1.5 rounded-full ${t.error ? "bg-destructive" : i === log.trace.length - 1 ? "bg-muted-foreground" : "bg-primary"}`} />
                                <span className={t.error ? "text-destructive" : "text-muted-foreground"}>{t.step}</span>
                              </span>
                              <span className="text-muted-foreground">{t.time}</span>
                            </div>
                          ))}
                        </div>

                        {log.status === "Failed" && (
                          <div className="mt-8">
                            <Button variant="outline" className="w-full gap-2 font-mono text-xs hover:bg-surface-foreground/5">
                              <RefreshCcw className="size-3" /> Retry Execution
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Showing 1-3 of 248 runs</span>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-surface-foreground/5">
                &lt;
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-surface-foreground/5">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
