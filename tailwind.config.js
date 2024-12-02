const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enables dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#1E3A8A', // Blue 800
        secondary: '#3B82F6', // Blue 500
        darkBg: '#1A202C', // Dark background
        darkCard: '#2D3748', // Dark card background
      },
      backgroundImage: {
        gradientBlue: 'linear-gradient(to right, #3B82F6, #1E3A8A)',
      },
      // Add keyframes and animations here
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideIn: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out',
        slideIn: 'slideIn 1s ease-in-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
