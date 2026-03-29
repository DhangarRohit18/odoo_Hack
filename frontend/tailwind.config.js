/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          DEFAULT: '#1e3a8a', // Dark Blue
          dark: '#1e1b4b',
        },
        accent: {
          success: '#10b981', // Green
          warning: '#f59e0b', // Yellow
          risk: '#ef4444',    // Red
        }
      },
    },
  },
  plugins: [],
}
