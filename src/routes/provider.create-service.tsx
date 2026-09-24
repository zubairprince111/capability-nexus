import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Cloud, Key, Type, Plus, Lock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/provider/create-service")({
  component: CreateServiceSchema,
});

const STEPS = [
  { id: 1, name: "Basic Info", status: "complete" },
  { id: 2, name: "Media", status: "complete" },
  { id: 3, name: "Pricing", status: "complete" },
  { id: 4, name: "Configuration Schema", status: "current" },
  { id: 5, name: "Execution", status: "upcoming" },
  { id: 6, name: "Review", status: "upcoming" },
];

function CreateServiceSchema() {
  const [fields, setFields] = useState([
    { id: 1, label: "OpenAI API Key", type: "API KEY", required: true, icon: Key },
    { id: 2, label: "Target Audience Description", type: "TEXT (LONG)", required: true, icon: Type },
  ]);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      {/* Stepper Header */}
      <div className="border-b border-border bg-surface px-8 py-6">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {STEPS.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? "pr-8 sm:pr-20" : ""}`}>
                <div className="flex items-center">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.status === "complete"
                        ? "border-primary bg-primary"
                        : step.status === "current"
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-muted bg-transparent text-muted-foreground"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <Check className="size-4 text-primary-foreground" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.625rem] font-medium tracking-wide ${
                      step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                  {stepIdx !== STEPS.length - 1 ? (
                    <div
                      className={`absolute left-8 top-4 hidden h-[2px] w-full -translate-y-1/2 sm:block ${
                        step.status === "complete" ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Configuration Schema Builder</h1>
          <p className="mt-2 text-muted-foreground">Define the inputs your buyers will need to provide before executing this tool.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Builder Column */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="font-mono">[]</span> Defined Inputs
              </h3>
              
              {fields.map((field) => (
                <div key={field.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <field.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{field.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      TYPE: {field.type} • {field.required ? "REQUIRED" : "OPTIONAL"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-surface/50 p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-medium text-foreground mb-6">
                <Plus className="size-4" /> Add New Input Field
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-mono text-muted-foreground">Field Label</label>
                  <input
                    type="text"
                    placeholder="e.g., Source Document"
                    className="mt-1.5 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-muted-foreground">Input Type</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                      <Type className="size-4" /> Text
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 py-3 text-xs font-medium text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]">
                      <Cloud className="size-4" /> File Upload
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                      <Key className="size-4" /> API Key
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-background/50 p-4">
                  <label className="text-xs font-mono text-muted-foreground">Allowed File Types</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-xs font-medium text-foreground border border-border">
                      .PDF ✕
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-xs font-medium text-foreground border border-border">
                      .DOCX ✕
                    </span>
                    <button className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                      + Add Format
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Required Field</p>
                      <p className="text-xs font-mono text-muted-foreground">Buyer must provide this input to execute.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                      <div className="absolute right-1 top-1 size-4 rounded-full bg-primary-foreground shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Encrypt Input</p>
                      <p className="text-xs font-mono text-muted-foreground">Store securely (recommended for keys/PII).</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-surface-foreground/20 relative cursor-pointer">
                      <div className="absolute left-1 top-1 size-4 rounded-full bg-background shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="outline" className="gap-2 font-mono text-xs">
                    <Check className="size-3" /> Save Field
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[0.625rem] font-mono font-bold tracking-widest text-primary uppercase">Live Buyer Preview</span>
              </div>
              
              {/* Fake Browser Window */}
              <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
                <div className="flex h-8 items-center gap-1.5 border-b border-border bg-surface px-4">
                  <div className="size-2.5 rounded-full bg-destructive/80" />
                  <div className="size-2.5 rounded-full bg-yellow-500/80" />
                  <div className="size-2.5 rounded-full bg-primary/80" />
                  <div className="mx-auto flex h-5 w-48 items-center justify-center rounded bg-background text-[0.625rem] font-mono text-muted-foreground">
                    aetherflow.ai/execute/tool-id
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-medium">Content Summarizer Pro</h2>
                  <p className="text-sm text-muted-foreground mt-1">Provide the required inputs to run this tool.</p>

                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        OpenAI API Key <span className="text-destructive">*</span>
                      </label>
                      <div className="mt-1.5 relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                          type="password"
                          placeholder="sk-..."
                          className="flex h-10 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center gap-1">
                        Target Audience Description <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        placeholder="e.g., Tech professionals looking for quick summaries..."
                        className="mt-1.5 flex min-h-[80px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        disabled
                      />
                    </div>

                    <div className="rounded-lg border border-primary/40 bg-primary/5 p-1">
                      <div className="rounded border-2 border-dashed border-primary/50 bg-background/50 p-6 text-center transition-colors">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                          <Cloud className="size-6 text-primary" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-primary">Click or drag file to upload</p>
                        <p className="mt-1 font-mono text-[0.625rem] text-muted-foreground">SUPPORTS .PDF, .DOCX</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button className="w-full justify-center gap-2 bg-surface-foreground/10 text-muted-foreground hover:bg-surface-foreground/20 hover:text-foreground">
                      ▶ Execute Tool
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex h-16 items-center justify-between border-t border-border bg-surface px-8">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Pricing
        </Button>
        <div className="flex gap-4">
          <Button variant="outline">Save Draft</Button>
          <Button className="gap-2">
            Continue to Execution <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
