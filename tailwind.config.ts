import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        "hiteen-pink": {
          50: "#fff1f7",
          100: "#ffe4ef",
          200: "#ffc9df",
          300: "#ff9fc4",
          400: "#ff69b4",
          500: "#ff3d9d",
          600: "#ff1a88",
          700: "#e60070",
          800: "#bd005c",
          900: "#9c004d",
        },
        "hiteen-blue": {
          50: "#eef3ff",
          100: "#e0e9ff",
          200: "#c7d6fe",
          300: "#a4bafc",
          400: "#7e97f8",
          500: "#1e40af",
          600: "#3b4da8",
          700: "#2d3a8c",
          800: "#283272",
          900: "#242c5f",
        },
        "custom-blue": "#2269FF",
      },
    },
  },
  plugins: [],
};

export default config;
