import type { Config } from "tailwindcss";

// Cense palette, carried over verbatim from Loan Desk so the tools read as one product. The neutral ramp overrides
// Tailwind's stock `slate`, so slate-* classes are the warm greens. Text tokens and their contrast on the page
// (#FFFCEC) and on white: slate-900 7.8:1, slate-700 6.1:1, slate-600 5.6:1. Do not set text in slate-400 or
// slate-500: they are for borders and marks. Orange text is accent-hover (#A8531F, 5.2:1); #C1652E is for marks only.
const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#F6F3E1",
          100: "#EAF3E7",
          200: "#DCE7D8",
          300: "#BFDCB8",
          400: "#8CA98E",
          500: "#5C7F5F",
          600: "#4A6E4D",
          700: "#3A6B3E",
          800: "#2F6133",
          900: "#275B2D",
        },
        navy: { DEFAULT: "#275B2D", hover: "#1E4623" },
        brand: {
          DEFAULT: "#275B2D",
          hover: "#1E4623",
          light: "#EAF3E7",
          border: "#BFDCB8",
        },
        accent: {
          DEFAULT: "#C1652E",
          hover: "#A8531F",
          light: "#F7E4D6",
        },
        page: "#FFFCEC",
        line: "#DCE7D8",
        selected: "#EAF3E7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // The floor. Nothing in the interface is set smaller than this.
        xs: ["0.8125rem", { lineHeight: "1.2rem" }],
      },
      boxShadow: {
        card: "0 1px 0 rgba(39, 91, 45, 0.04), 0 8px 24px -12px rgba(39, 91, 45, 0.18)",
        lift: "0 1px 0 rgba(39, 91, 45, 0.05), 0 16px 32px -16px rgba(39, 91, 45, 0.28)",
      },
    },
  },
  plugins: [],
};
export default config;
