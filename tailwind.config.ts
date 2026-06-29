import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from Atelier Shreenu brand book
        burgundy: "#7D2027",
        "deep-wine": "#5E1A20",
        charcoal: "#1C1C1C",
        parchment: "#F5F0E8",
        "warm-ivory": "#FAF7F2",
        "muted-brass": "#A68B5B",
        stone: "#D4C4B8",
        "warm-grey": "#8C8579",

        // Legacy aliases (mapped to new brand colors)
        bone: "#FAF7F2", // warm-ivory
        ink: "#1C1C1C", // charcoal
        terracotta: "#7D2027", // burgundy
        sandstone: "#F5F0E8", // parchment
      },
      fontFamily: {
        // Primary display serif - Cormorant Garamond
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        // Secondary body sans - Jost
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.08em" }], // 12px - Jost labels
      },
      letterSpacing: {
        tight: "-0.02em",
        normal: "0",
        wide: "0.03em",
        wider: "0.06em",
        widest: "0.08em",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "ken-burns": "kenBurns 2.75s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1.07)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
