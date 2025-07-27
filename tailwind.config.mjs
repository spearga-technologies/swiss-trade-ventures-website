/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#0003ff',
          100: '#cce6ff',
          200: '#99cfff',
          300: '#66b7ff',
          400: '#339fff',
          500: '#0003ff',
          600: '#0003ff',
          700: '#0003cc',
          800: '#0003b3',
          900: '#003d80',
        }
      }
    },
  },
  plugins: [],
}