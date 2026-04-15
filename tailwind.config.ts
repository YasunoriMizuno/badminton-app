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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          teal: "#006B6B",
          "teal-dark": "#004f4f",
          yellow: "#FFD000",
          "yellow-dark": "#e6bb00",
          orange: "#e85d35",
          sky: "#0090b8",
          ocean: "#0069a8",
          mint: "#d0e9e9",
          "sky-soft": "#c5e8f2",
          "orange-soft": "#ffd8c4",
          "yellow-soft": "#fff8cc",
        },
      },
    },
  },
  plugins: [],
};
export default config;
