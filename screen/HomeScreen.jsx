import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from "../navigations/AuthProvider";
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly


const HomeScreen = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);
  //console.log('user', user);
  const { theme, toggleColorScheme } = useTheme(); // Accessing the theme and toggle function


  return (
    <SafeAreaView className='flex-1 justify-center items-center'>

      



      <TouchableOpacity onPress={(logout)}>
        <Text>Loginout</Text>
      </TouchableOpacity>


      <Button
        title="Toggle Theme"
        onPress={toggleColorScheme} // Call the toggle function on press
        color={theme.textColor} // Set button color based on text color
      />
    </SafeAreaView>
  )
}

export default HomeScreen

