/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      },
      fontFamily: {
        sans: ["var(--font-geist)"],
        display: ["var(--font-bricolage)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
}
