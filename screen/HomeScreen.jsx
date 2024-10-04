import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import JIcon from '../assets/J.svg'

const HomeScreen = () => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-white'>
      <View className='mt-12'>
        <Text className='text-3xl font-bold text-[#20315f] font-primaryMedium'>
          IT Helpdesk
        </Text>
      </View>
      <View className='flex-1 justify-center items-center'>
        <JIcon widht={200} height={200} />
      </View>
      <TouchableOpacity className='bg-[#AD40AF] p-5 w-[90%] rounded-md flex-row justify-between mb-12'>
        <Text className='font-bold text-lg font-primaryBold text-white'>เริ่มต้นใช้งาน</Text>
        <MaterialIcon name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default HomeScreen

