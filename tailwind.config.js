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
        xs: '375px',
        '3xl': '1920px'
      },
      colors: {
        primary: {
          50: '#EAFEFE',
          100: '#C6FCFC',
          200: '#9AF7F7',
          300: '#64F2F2',
          400: '#2AE4E4',
          500: '#00BDBD',
          600: '#08A4A9',
          700: '#11868B',
          800: '#167075',
          900: '#155C61',
          950: '#074045',
          DEFAULT: '#00BDBD'
        },
        gray: {
          100: '#F9F9F9',
          200: '#E9E9E9',
          300: '#D3D3D3',
          400: '#939393',
          500: '#4F4F4F',
          900: '#1A1A1A',
          DEFAULT: '#4F4F4F'
        },
        secondary: {
          50: '#EFF5F5',
          100: '#EFF5F5',
          200: '#EAF8F8',
          300: '#EAF8F8',
          400: '#008E86',
          500: '#008E86',
          600: '#008E86',
          700: '#00605A',
          800: '#00605A',
          DEFAULT: '#008E86'
        },
        info: '#008E86',
        error: '#F15761',
        success: '#00C2FF',
        light: '#4F4F4F'
      },
      fontFamily: {
        sans: [
          'var(--font-ubuntu)',
          'var(--font-noto_sans_tc)',
          ...fontFamily.sans
        ],
        alkatra: ['var(--font-alkatra)']
      }
    }
  },
  plugins: []
};
