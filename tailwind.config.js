/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'body': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui',
        // other fallback fonts
      ],
      'sans': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui',
        // other fallback fonts
      ]
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
  
};

export default config;