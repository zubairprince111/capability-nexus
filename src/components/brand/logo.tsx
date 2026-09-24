import { cn } from "@/lib/utils";

/**
 * AI5K official brand mark.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img 
      src="/ai5k_logo-removebg-preview.png" 
      alt="AI5K Logo" 
      className={cn("h-8 w-auto object-contain shrink-0", className)} 
    />
  );
}

export function Wordmark({ className }: { className?: string; subtle?: boolean }) {
  return (
    <img 
      src="/ai5k_logo-removebg-preview.png" 
      alt="AI5K Logo" 
      className={cn("h-8 w-auto object-contain shrink-0", className)} 
    />
  );
}
