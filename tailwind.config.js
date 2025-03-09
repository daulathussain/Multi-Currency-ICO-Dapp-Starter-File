// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        fuchsia: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        progressAnimation: "progressAnimation 2s ease-out forwards",
        slowSlideDown: "slowSlideDown 1.2s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        progressAnimation: {
          "0%": { width: "0%" },
          "100%": { width: "75%" },
        },
        slowSlideDown: {
          "0%": { transform: "translateY(-100%)" },
          "15%": { transform: "translateY(-90%)" },
          "30%": { transform: "translateY(-75%)" },
          "50%": { transform: "translateY(-50%)" },
          "70%": { transform: "translateY(-25%)" },
          "85%": { transform: "translateY(-10%)" },
          "100%": { transform: "translateY(0)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-reverse": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        pulse: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: 0.4,
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: 0.7,
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
