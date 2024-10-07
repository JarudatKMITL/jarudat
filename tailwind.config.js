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
      Bold:['Poppins-Bold'],
      Light:['Poppins-Light'],
      Medium:['Poppins-Medium'],
      Regular:['Poppins-Regular'],
      SemiBold:['Poppins-SemiBold'],
    },
    extend: {
      colors:{
        primary: "#45484A",
        accent: "#AEB5BB",
        gray:"#D9D9D9",
        bgblue:"#e5eff8"
      },
    }
  },
  plugins: [],
}

