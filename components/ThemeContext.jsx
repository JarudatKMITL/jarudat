import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'nativewind'; // Uses the color scheme from nativewind

// Define light and dark themes
const lightTheme = {
  backgroundColor: '#FAFAFA',
  textColor: '#45484A',
  accentColor: '#ECEFF1',
  iconProfile: '#000',
  borderColor: '#333333',
  bghTicket: '#003c82',
  serviceT: '#FFF',
  background: '#f0f0f0',
  text: '#333',
  button: '#007bff',
  buttonText: '#fff',
  modalBackground: '#ffffff',
  cardBackground: '#ffffff',
  headerBackground: '#ffffff',
  shadowColor: '#000',
  gradientStart: '#4c669f', // สีเริ่มต้นของ gradient
  gradientEnd: '#3b5998',   // สีสุดท้ายของ gradient
  backgroundColor: '#FAFAFA',
  tabBarBackgroundColor: '#FFFFFF',
  tabBarActiveTintColor: '#FF9800', // สีส้มสำหรับไอคอนที่เลือก
  tabBarInactiveTintColor: '#888',  // สีเทาสำหรับไอคอนที่ไม่เลือก
};

const darkTheme = {
  backgroundColor: '#222222',
  textColor: '#EEEEEE',
  accentColor: '#424242',
  iconProfile: '#FFF',
  borderColor: '#ECEFF1',
  bghTicket: '#424242',
  serviceT: '#9E9E9E',
  background: '#121212',
  text: '#f0f0f0',
  button: '#1a73e8',
  buttonText: '#f0f0f0',
  modalBackground: '#333333',
  cardBackground: '#1e1e1e',
  headerBackground: '#333333',
  shadowColor: '#000',
  gradientStart: '#232526', // สีเริ่มต้นของ gradient
  gradientEnd: '#414345',   // สีสุดท้ายของ gradient
  backgroundColor: '#121212',
  tabBarBackgroundColor: '#222222',
  tabBarActiveTintColor: '#FFD700', // สีเหลืองสดใสสำหรับไอคอนที่เลือก
  tabBarInactiveTintColor: '#555',  // สีเทาเข้มสำหรับไอคอนที่ไม่เลือก
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
