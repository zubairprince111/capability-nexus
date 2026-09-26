import type { Config } from "tailwindcss";

// AI5K Design System (Next.js / dark-leaning)
// Supabase × ChatGPT fusion:
//   - dark canvas (canvas), hairline borders, restrained green/teal accents.
//   - mono labels for technical metadata, editorial display type.
//   - no purple, no glow blobs, no glassmorphism.
// One ground: a single dark surface (#0a0a0a) with subtle layered surfaces.

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Canvas
        ink: "#e8e9ea",
        "ink-soft": "#cfd0d3",
        "ink-2": "#a8a9ad",
        muted: "#8a8c93",
        "muted-2": "#6b6d74",
        "muted-3": "#4f5158",
        hairline: "#1f2024",
        "border-light": "#26272c",
        "border-glow": "#2e3338",
        canvas: "#0a0a0a",
        stone: "#131316",
        "stone-2": "#19191d",
        elevated: "#1c1c20",
        "elevated-2": "#232328",
        // Accent palette — restrained, never aggressive.
        "near-black": "#0a0a0a",
        "brand-green": "#15846E",
        "brand-emerald": "#10b981",
        "brand-mint": "#6ee7b7",
        "brand-cyan": "#22d3ee",
        "brand-deep": "#0d473f",
        navy: "#0b1c2c",
        // Semantic
        "focus-blue": "#4c6ee6",
        "error-red": "#ff5a5a",
        "warn-amber": "#f59e0b",
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Arial", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "section-display": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "section-heading": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "card-heading": ["1.25rem", { lineHeight: "1.25" }],
        body: ["0.9375rem", { lineHeight: "1.55" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.5" }],
        caption: ["0.8125rem", { lineHeight: "1.45" }],
        micro: ["0.6875rem", { lineHeight: "1.35", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        xs: "3px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      maxWidth: {
        shell: "1200px",
        text: "640px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "soft-breathe": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.012)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-8px,0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ring-pulse": {
          "0%": { opacity: "0.55", transform: "scale(0.985)" },
          "100%": { opacity: "0", transform: "scale(1.18)" },
        },
        "tick": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 400ms ease-out both",
        "soft-breathe": "soft-breathe 6s ease-in-out infinite",
        "drift-slow": "drift-slow 9s ease-in-out infinite",
        "shimmer": "shimmer 2.2s linear infinite",
        "ring-pulse": "ring-pulse 2.6s ease-out infinite",
        "tick": "tick 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        "ring-soft": "0 0 0 1px rgba(38, 39, 44, 0.7), 0 12px 36px -16px rgba(0, 0, 0, 0.6)",
        "ring-emerald": "0 0 0 1px rgba(16, 185, 129, 0.35), 0 14px 40px -16px rgba(16, 185, 129, 0.25)",
        "elev-card": "0 1px 0 rgba(255,255,255,0.02) inset, 0 24px 60px -36px rgba(0,0,0,0.7)",
        "elev-card-hover": "0 1px 0 rgba(255,255,255,0.04) inset, 0 28px 70px -32px rgba(0,0,0,0.85)",
      },
    },
  },
  plugins: [],
};

export default config;
