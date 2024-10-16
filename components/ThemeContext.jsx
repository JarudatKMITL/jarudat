import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'nativewind'; // Uses the color scheme from nativewind

// Define light and dark themes
const lightTheme = {
  backgroundColor: '#e5eff8',
  textColor: '#45484A',
  accentColor: '#6200EE',
  disabledColor: '#BDBDBD',
  dividerColor: '#E0E0E0',
  iconProfile: '#FF6347',
};

const darkTheme = {
    backgroundColor: '#222831',  // สีพื้นหลัง
    textColor: '#EEEEEE',        // สีข้อความ
    accentColor: '#393E46',      // สีเน้น
    disabledColor: '#BDBDBD',    // สีสำหรับองค์ประกอบที่ไม่สามารถใช้ได้
    iconProfile: '#FFD369',
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
