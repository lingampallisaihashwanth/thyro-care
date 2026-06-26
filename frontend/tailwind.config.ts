import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        thyro: {
          blue: "#1768AC",
          navy: "#12355B",
          green: "#1F9D72",
          red: "#D94141",
          mint: "#E6F7F1",
          sky: "#EAF5FF",
          ink: "#172033",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 51, 0.12)",
        crisp: "0 10px 30px rgba(18, 53, 91, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
