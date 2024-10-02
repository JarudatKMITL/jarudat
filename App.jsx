import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import HomeScreen from './screen/HomeScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

const App = () => {
  return (


    <HomeScreen/>






  )
}

export default App

const styles = StyleSheet.create({
  customFont: {
    fontFamily: 'Anakotmai-Bold',

  },
  customFont2: {
    fontFamily: 'Anakotmai-Light',

  },
  customFont10: {
    fontFamily: 'Anakotmai-Medium',

  },
});