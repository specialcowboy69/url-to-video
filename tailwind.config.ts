import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        mist: "#eef2f6",
        citrus: "#d7ff47",
        ocean: "#0b7285",
        coral: "#ff6b57",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(20, 20, 20, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
