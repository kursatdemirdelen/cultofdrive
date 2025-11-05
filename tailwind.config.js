/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ['"Bebas Neue"', "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#0071e3",
          light: "#3ea8ff",
          dark: "#005bb5",
        },
        // BMW esintili koyu tonlar
        garage: "#0a0a0a",
        midnight: "#101010",
        carbon: "#1a1a1a",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
      boxShadow: {
        glow: "0 0 15px rgba(255,255,255,0.05)",
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
