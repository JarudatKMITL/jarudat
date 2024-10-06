import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import JIcon from '../assets/J.svg'

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-primary text-4xl'>หน้าหลัก User</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Ticket')}>
        <Text>wxjsjsjs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeScreen

