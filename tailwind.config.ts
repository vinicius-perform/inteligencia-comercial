import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Oficial High-End
        background: "#F3F4F6", // Fundo claro principal
        surface: "#FFFFFF",    // Superfície dos cards elevados
        dark: {
          DEFAULT: "#0C0C0D",  // Cor escura principal para textos, ativos e contraste
          hover: "#18181A",
          surface: "#141416",
          subtle: "#1C1C1F",
          border: "#27272A",
        },
        lime: {
          DEFAULT: "#CEF52A",  // Cor de destaque / accent / highlights
          hover: "#BEE81E",
          active: "#AFDB10",
          soft: "#F4FDE2",     // Fundo suave com opacidade
          border: "#D7F755",
        },
        muted: {
          DEFAULT: "#71717A",  // Cinza neutro moderno para subtítulos
          foreground: "#A1A1AA",
          light: "#F3F4F6",
        },
        border: {
          DEFAULT: "#E5E7EB",
          subtle: "#ECEEF2",
        },
      },
      borderRadius: {
        'pill': '9999px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(12, 12, 13, 0.02), 0 4px 16px -2px rgba(12, 12, 13, 0.04)',
        'card-hover': '0 8px 30px -4px rgba(12, 12, 13, 0.08), 0 2px 8px -1px rgba(12, 12, 13, 0.03)',
        'pill': '0 2px 10px rgba(12, 12, 13, 0.06)',
        'glow-lime': '0 0 24px rgba(206, 245, 42, 0.35)',
        'modal': '0 24px 64px -12px rgba(12, 12, 13, 0.16)',
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "SF Pro",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        'apple-title': '-0.045em',
        'apple-kpi': '-0.055em',
        'apple-card': '-0.02em',
        'apple-sub': '-0.01em',
      },
    },
  },
  plugins: [],
};
export default config;
