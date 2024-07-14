/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral': {
          DEFAULT: '#b6bcc6',
          '700': '#374151'
        }
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
    container: {
      center: true,
      screens: {
        '2xl': '1400px',
      },
      padding: {
        DEFAULT: '25px',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '4.5rem',
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

