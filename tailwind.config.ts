import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./shared/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f7f6f2",
        ink: "#111111",
        subtle: "#6c6c6c",
        brand: {
          50: "#f6f4ff",
          100: "#ece8ff",
          500: "#4b3fd6",
          700: "#2f278e"
        },
        surface: "#ffffff",
        border: "#e4e1d9",
        success: "#0f7d3e",
        warning: "#b8660b",
        danger: "#b11f2a"
      },
      fontFamily: {
        display: ["Aref Ruqaa Ink", "serif"],
        body: ["Vazirmatn", "sans-serif"]
      },
      borderRadius: {
        xl: "18px"
      },
      boxShadow: {
        soft: "0 12px 32px rgba(17,17,17,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
