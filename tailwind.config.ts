import type { Config } from "tailwindcss";

// -- 🎨 Configuration Tailwind CSS 4 pour HailiteManager
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // -- Couleurs Hailite brand
        hailite: {
          blue: "#1E40AF",
          dark: "#0F172A",
          accent: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
