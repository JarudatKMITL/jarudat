import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-primary text-4xl'>หน้าหลัก Userhihuh</Text>
      <TouchableOpacity onPress={() => { navigation.navigate('loginHome', ) }}>
        <Text>wxjsjsjs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeScreen

