import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from "../navigations/AuthProvider";
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../components/LanguageContext';

const HomeKnowleadScreen = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);
  //console.log('user', user);
  const { theme, toggleColorScheme } = useTheme(); // Accessing the theme and toggle function

  const { t } = useTranslation();
  const { toggleLanguage } = useContext(LanguageContext);
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>



      <Text>{t('welcome')}</Text>
      <Button title={t('change_language')} onPress={toggleLanguage} />

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

export default HomeKnowleadScreen;




