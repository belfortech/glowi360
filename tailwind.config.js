/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'script': ['"Great Vibes"', 'cursive'],
      },
      colors: {
        // Core 3-Color Palette
        primary: '#C9A24D',           // Soft Gold / Champagne Gold (accents)
        secondary: '#0B0B0B',         // Matte Black (backgrounds)

        // Background
        black: '#0B0B0B',             // Matte Black / Charcoal
        charcoal: '#0B0B0B',          // Alias for black

        // Accent
        gold: '#C9A24D',              // Soft Gold / Champagne Gold

        // Typography
        offwhite: '#F5F5F5',          // Off-white (primary text on dark)
        warmgray: '#9CA3AF',          // Warm gray (secondary text)

        // Legacy support
        grey: '#9CA3AF',
      },
    },
  },
  plugins: [],
}
