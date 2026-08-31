/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bubble: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          pink: {
            light: "#FFF1F2",
            DEFAULT: "#F43F5E",
            dark: "#BE123C",
          },
          peach: {
            light: "#FFF4ED",
            DEFAULT: "#FB923C",
            dark: "#C2410C",
          },
          mint: {
            light: "#ECFDF5",
            DEFAULT: "#10B981",
            dark: "#047857",
          },
          blue: {
            light: "#EFF6FF",
            DEFAULT: "#3B82F6",
            dark: "#1D4ED8",
          },
          lemon: {
            light: "#FEFCE8",
            DEFAULT: "#FACC15",
            dark: "#A16207",
          },
          purple: {
            light: "#FAF5FF",
            DEFAULT: "#A855F7",
            dark: "#7E22CE",
          }
        },
      },
      borderRadius: {
        'bubble': '1.5rem',
        'bubble-lg': '2rem',
        'bubble-xl': '2.5rem',
      },
      boxShadow: {
        'bubble': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'bubble-hover': '0 14px 30px -4px rgba(0, 0, 0, 0.1)',
        'bubble-active': '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'bounce-subtle': 'bounce 2s infinite',
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
