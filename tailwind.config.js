const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px'
      },
      colors: {
        primary: {
          50: '#EAFEFE',
          100: '#C6FCFC',
          200: '#9AF7F7',
          300: '#64F2F2',
          400: '#2AE4E4',
          500: '#00C7C7',
          600: '#08A4A9',
          700: '#11868B',
          800: '#167075',
          900: '#155C61',
          950: '#074045',
          DEFAULT: '#00C7C7'
        },
        'primary-emphasis': {
          50: '#E7FBF6',
          100: '#C2F9ED',
          200: '#95F2E2',
          300: '#57D9C9',
          400: '#1FB9A9',
          500: '#008E86',
          600: '#057070',
          700: '#0B585B',
          800: '#0E4649',
          900: '#0D3A3D',
          950: '#053134',
          DEFAULT: '#008E86'
        },
        secondary: '#EAF8F8',
        success: '#00C2FF',
        light: '#4F4F4F'
      },
      fontFamily: {
        sans: ['var(--font-noto_sans_tc)', ...fontFamily.sans],
        alkatra: ['var(--font-alkatra)']
      }
    }
  },
  plugins: []
};
