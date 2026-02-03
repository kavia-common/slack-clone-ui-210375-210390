/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slack-inspired color palette with retro theme
        slack: {
          purple: {
            dark: '#4A154B',
            DEFAULT: '#611f69',
            light: '#731d78',
          },
          teal: {
            dark: '#007A5A',
            DEFAULT: '#1d9bd1',
            light: '#2eb67d',
          },
          red: '#e01e5a',
          yellow: '#ecb22e',
          // Retro theme colors
          retro: {
            purple: '#8b5cf6',
            pink: '#ec4899',
            orange: '#f97316',
            cyan: '#06b6d4',
          }
        },
        sidebar: {
          DEFAULT: '#3f0e40',
          hover: 'rgba(255, 255, 255, 0.06)',
          active: '#1164a3',
        },
        primary: '#3b82f6',
        secondary: '#64748b',
        success: '#06b6d4',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'slack': '0 1px 0 rgba(0,0,0,0.1)',
        'slack-lg': '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
