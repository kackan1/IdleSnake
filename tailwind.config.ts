import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#0077FF',   /* Electric Blue – Główny kolor, akcenty, CTA */
        secondary: '#39FF14', /* Neon Green – Dla wyróżniających się elementów */
        accent: '#00FFFF',    /* Cyan – Dodatkowe akcenty lub hover efekty */
        danger: '#8B0000',    /* Dark Red – Kolor dla błędów lub alertów */
        highlight: '#FF00FF', /* Magenta – Kolor podkreśleń, np. aktywne stany */
        darkPurple: '#800080',/* Deep Purple – Dodatkowe tło lub sekcje */
        muted: '#C0C0C0',     /* Silver – Delikatne elementy, tekst pomocniczy */
        warning: '#FF4500',   /* Orange – Ostrzeżenia lub dynamiczne efekty */
      },
    },
  },
  plugins: [],
};
export default config;
