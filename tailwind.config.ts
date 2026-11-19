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
        dark: {
          950: "#09090a",
          900: "#121214",
          850: "#1a1a1e",
          800: "#202024",
          750: "#27272a",
          700: "#29292e",
          600: "#323238",
          500: "#3d3d45",
          400: "#71717a",
          300: "#a8a8b3",
          200: "#c4c4cc",
          100: "#e1e1e6",
        },
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#996dff",
          600: "#8257e5",
          700: "#6a39d8",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
