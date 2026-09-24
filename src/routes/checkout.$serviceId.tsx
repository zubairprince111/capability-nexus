import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CreditCard, Lock, Smartphone } from "lucide-react";
import { useState } from "react";

import { Wordmark } from "@/components/brand/logo";

export const Route = createFileRoute("/checkout/$serviceId")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { serviceId } = Route.useParams();
  const [method, setMethod] = useState<"card" | "bkash" | "nagad">("card");

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="flex h-16 items-center justify-between px-8">
        <Link to="/" aria-label="AI5K home">
          <Wordmark />
        </Link>
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Cancel
        </Button>
      </header>

      <main className="flex-1 px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Order Summary (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-8">
              <h2 className="text-2xl font-semibold mb-8">Order Summary</h2>
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <div className="size-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="size-10 rounded-full bg-primary/40 blur-sm absolute" />
                  <span className="relative z-10 font-bold text-primary text-xl">NS</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Neural Synthesizer Pro</h3>
                  <p className="text-sm font-mono text-primary mt-1">API Key Access</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base License</span>
                  <span className="font-mono font-medium">$149.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (VAT 20%)</span>
                  <span className="font-mono font-medium">$29.80</span>
                </div>
              </div>

              <div className="flex items-end justify-between pt-8 border-t border-border">
                <span className="text-lg font-medium">Total</span>
                <span className="text-4xl font-bold text-primary font-mono tracking-tight">$178.80</span>
              </div>

              <div className="mt-8">
                <span className="inline-block rounded-full bg-surface-foreground/5 border border-border px-3 py-1 text-xs font-medium text-muted-foreground font-mono">
                  One-Time Purchase
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form (Right Column) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface p-8 lg:p-10">
              <h3 className="text-xl font-semibold mb-6">Billing Details</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[0.625rem] font-mono font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
                  <input
                    type="text"
                    defaultValue="Jane"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.625rem] font-mono font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[0.625rem] font-mono font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    defaultValue="jane@agency.com"
                    className="flex h-11 w-full rounded-md border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button 
                  onClick={() => setMethod("card")}
                  className={`flex flex-col items-center justify-center gap-3 rounded-lg border py-4 transition-all ${
                    method === "card" 
                      ? "border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <CreditCard className="size-6" />
                  <span className="text-xs font-mono font-medium">Card</span>
                </button>
                <button 
                  onClick={() => setMethod("bkash")}
                  className={`flex flex-col items-center justify-center gap-3 rounded-lg border py-4 transition-all ${
                    method === "bkash" 
                      ? "border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Smartphone className="size-6" />
                  <span className="text-xs font-mono font-medium">bKash</span>
                </button>
                <button 
                  onClick={() => setMethod("nagad")}
                  className={`flex flex-col items-center justify-center gap-3 rounded-lg border py-4 transition-all ${
                    method === "nagad" 
                      ? "border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Smartphone className="size-6" />
                  <span className="text-xs font-mono font-medium">Nagad</span>
                </button>
              </div>

              {method === "card" && (
                <div className="space-y-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[0.625rem] font-mono font-bold uppercase tracking-widest text-muted-foreground">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="flex h-11 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[0.625rem] font-mono font-bold uppercase tracking-widest text-muted-foreground">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="flex h-11 w-full rounded-md border border-border bg-background px-4 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.625rem] font-mono font-bold uppercase tracking-widest text-muted-foreground">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="flex h-11 w-full rounded-md border border-border bg-background px-4 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method !== "card" && (
                <div className="mb-8 rounded-lg border border-border bg-background p-6 text-center">
                  <Smartphone className="mx-auto size-8 text-muted-foreground mb-4" />
                  <p className="text-sm">You will be redirected to the secure {method === "bkash" ? "bKash" : "Nagad"} portal to complete your payment.</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-6">
                <Lock className="size-3.5 text-primary" />
                <span className="text-[0.625rem] font-mono text-muted-foreground uppercase tracking-widest">Payments are secured and encrypted.</span>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                Confirm Purchase <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex h-16 items-center justify-between border-t border-border bg-surface px-8 text-[0.625rem] font-mono text-muted-foreground">
        <div>
          <span className="text-primary font-bold">AI5K</span> © 2026 Secure Infrastructure.
        </div>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-foreground">Terms</Link>
          <Link to="/" className="hover:text-foreground">Privacy</Link>
          <Link to="/" className="hover:text-foreground">Status</Link>
          <Link to="/" className="hover:text-foreground">API Docs</Link>
        </div>
      </footer>
    </div>
  );
}

// Minimal inline button for the cancel link to avoid extra imports if unneeded, 
// but we used standard Button so let's import it:
import { Button } from "@/components/ui/button";
