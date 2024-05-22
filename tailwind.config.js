/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'big': '2000px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        'gray': "#848D97",
        'gray-100': "rgba(132, 141, 151, 0.3)",
        'graybg': "rgba(66,86,116,0.2)",
        'modra': "#0FC2C0",
        'ruzova': "#C21098"
      }     
    },
  },
  plugins: [],
}