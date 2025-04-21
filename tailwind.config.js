/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kairos: {
          primary: '#4362d5',    // Dominant background blue
          primary2: '#4261d4',   // Slightly darker variant
          shadow: '#3c5bce',     // Subtle shadow/gradient tone
          primary3: '#4261d5',   // Nearly identical to #2
          primary4: '#4362d4',   // Slightly different from #1
          accent: '#5b78e3',     // Light accent highlight blue
          primary5: '#4262d5',   // Variant of #1 and #2
          button: '#3c5cce',     // Mid-blue used in shadows or buttons
          support: '#4160d3',    // Supporting blue
          bright: '#5c79e3',     // Bright button accent variation
          // Dark mode colors
          dark: '#1a2344',       // Dark mode background
          darkAccent: '#2a3a6b', // Dark mode accent
        },
        star: '#FEC43F',         // Star rating color
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
