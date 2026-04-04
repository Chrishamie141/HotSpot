import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          bg: "#080810",
          card: "#111121",
          glow: "#7c3aed",
          accent: "#22d3ee"
        }
      },
      boxShadow: {
        glow: "0 0 24px rgba(124,58,237,0.45)"
      }
    }
  },
  plugins: []
};

export default config;
