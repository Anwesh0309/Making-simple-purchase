/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:   { DEFAULT: '#ffc107', light: '#ffd54f', dark: '#f9a825' },
        purple: { deep: '#2d1b69', mid: '#4a2c8a', light: '#7c5cbf' },
        blue:   { deep: '#1a237e', mid: '#283593', bright: '#3f51b5' },
        green:  { DEFAULT: '#4caf50', light: '#81c784' },
        coral:  { DEFAULT: '#ff7043' },
        card:   { DEFAULT: 'rgba(30,30,100,0.7)' },
      },
      fontFamily: {
        display: ['"Fredoka"', 'sans-serif'],
        body:    ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px', md: '16px', lg: '24px', xl: '32px', full: '9999px',
      },
    },
  },
  plugins: [],
};
