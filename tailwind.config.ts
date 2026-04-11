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
          teal: "#00756a",
          "teal-dark": "#005a52",
          yellow: "#e8a800",
          orange: "#e85d35",
          sky: "#0090b8",
          ocean: "#0069a8",
          mint: "#dcefe3",
          "sky-soft": "#c5e8f2",
          "orange-soft": "#ffd8c4",
          "yellow-soft": "#fff3cd",
        },
      },
    },
  },
  plugins: [],
};
export default config;
