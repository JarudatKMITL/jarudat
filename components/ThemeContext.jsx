import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'nativewind'; // Uses the color scheme from nativewind

// Define light and dark themes
const lightTheme = {
  backgroundColor: '#DEE4E7',
  textColor: '#45484A',
  accentColor: '#ECEFF1',
  iconProfile: '#000',
};

const darkTheme = {
  backgroundColor: '#222222',  // สีพื้นหลัง
  textColor: '#EEEEEE',        // สีข้อความ
  accentColor: '#424242',     // สีตัด
  iconProfile: '#FFF',

};

// Create a context for theme
const ThemeContext = createContext();

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const { colorScheme, setColorScheme } = useColorScheme(); // useColorScheme from nativewind

  // Handle theme toggle (light/dark switch)
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark'); // Toggle logic
  };

  // Determine the current theme based on the colorScheme
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
