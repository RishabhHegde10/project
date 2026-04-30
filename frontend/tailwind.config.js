/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(124,58,237,0.15), 0 2px 10px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

