/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        lg: "32px",
        "lg-indicator": "16px",
      },
      backdropSaturate: {
        lg: "180%",
        "lg-indicator": "200%",
      },
      borderWidth: {
        hairline: "0.5px",
      },
      boxShadow: {
        "lg-surface":
          "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -0.5px 0 rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.1), 0 14px 36px -16px rgba(0,0,0,0.45), 0 4px 14px -8px rgba(0,0,0,0.3)",
        "lg-surface-scroll":
          "inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -0.5px 0 rgba(0,0,0,0.15), inset 0 0 0 0.5px rgba(255,255,255,0.14), 0 18px 44px -16px rgba(0,0,0,0.5), 0 6px 18px -8px rgba(0,0,0,0.35)",
        "lg-indicator":
          "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -0.5px 0 rgba(0,0,0,0.08), 0 1px 8px rgba(0,0,0,0.15)",
        "lg-indicator-active":
          "inset 0 1px 0 rgba(255,255,255,0.09), 0 0 18px rgba(99,102,241,0.1)",
      },
      colors: {
        "act1-canvas": "#07070e",
        "act1-surface": "#0d0d1a",
        "act1-text": "#d0d0e8",
        "act2-canvas": "#090914",
        "act2-text": "#f0f0ff",
        "act3-canvas": "#0c0c1e",
        rose: "#ff4d6d",
        indigo: "#6366f1",
        "indigo-light": "#818cf8",
        emerald: "#34d399",
        sky: "#38bdf8",
        "text-muted": "#70709a",
        "text-secondary": "#9a9ac0",
        "lg-surface": "rgba(255, 255, 255, 0.1)",
        "lg-surface-scroll": "rgba(255, 255, 255, 0.14)",
        "lg-indicator": "rgba(255, 255, 255, 0.07)",
        "lg-indicator-active": "rgba(255, 255, 255, 0.09)",
      },
      fontFamily: {
        sans: ["var(--font-geist)"],
        display: ["var(--font-bricolage)"],
        mono: ["var(--font-geist-mono)"],
      },
      transitionTimingFunction: {
        lg: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      perspective: {
        lg: "900px",
      },
      blur: {
        "lg-text": "0.4px",
        "lg-text-cta": "0.35px",
      },
    },
  },
  plugins: [],
};
