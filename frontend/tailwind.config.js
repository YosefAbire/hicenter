/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        background: "#F9F6F0",
        foreground: "#1C1917",
        paper: {
          50: "#FFFFFF",
          100: "#F9F6F0",
          150: "#F4EFE6",
          200: "#F1ECE4",
          300: "#E5DFD5",
          400: "#D8D2C6",
          500: "#C3BCAE",
        },
        teal: {
          800: "#115E59",
          900: "#0D4A47",
          950: "#093734",
        },
        ochre: {
          100: "#FEF3C7",
          600: "#D97706",
          700: "#B45309",
          800: "#8B4513",
        }
      },
      boxShadow: {
        'paper': '0 1px 3px 0 rgba(28, 25, 23, 0.03), 0 1px 2px -1px rgba(28, 25, 23, 0.03)',
        'paper-md': '0 4px 12px -2px rgba(28, 25, 23, 0.05), 0 2px 4px -2px rgba(28, 25, 23, 0.03)',
      },
    },
  },
  plugins: [],
};
