/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./screen/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      primary: ['Anakotmai-Bold'], // เพิ่มฟอนต์ที่คุณต้องการ
    },
    extend: {
      colors:{
        primary: "#1c1c22",
        accent:{
          DEFAULT: "#00ff99",
          hover: "00e187",
        }
      },
    }
  },
  plugins: [],
}

