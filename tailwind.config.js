/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./screen/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    fontFamily: {
      primary: ['Anakotmai-Bold'],
      primaryLight:['Anakotmai-Light'],
      primaryMedium:['Anakotmai-Medium'],

    },
    extend: {
      colors:{
        primary: "#aa18ea",
        accent: "1f212c",
      },
    }
  },
  plugins: [],
}

