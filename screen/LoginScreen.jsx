import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import JIcon from '../assets/J.svg'

const LoginScreen = () => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-white'>
      <View className='mt-12 flex-col justify-center items-center'>
        <Text className='text-4xl font-bold text-[#20315f] '>
          Wellcome to
        </Text>
        <Text className='mt-3 text-3xl font-bold text-[#20315f] '>
          IT Helpdesk Application
        </Text>
      </View>
      <View className='flex-1 justify-center items-center'>
        <JIcon widht={200} height={200} />
      </View>
      <TouchableOpacity
        className='bg-[#AD40AF] p-5 w-[90%] rounded-xl flex-row justify-between mb-12'
        onPress={() => navigation.navigate('Home')}
        >
        <Text className='font-bold text-lg font-primaryBold text-white'>Get started</Text>
        <MaterialIcon name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default LoginScreen