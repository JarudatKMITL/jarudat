import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
const OnboardingScreen = () => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-white'>
      <View>
        <Text className='text-2xl font-primaryBold'>
          HOME Game
        </Text>
      </View>
      <TouchableOpacity>
        <Text>Letgo's Begin</Text>
        <Text>Letgo's Begin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default OnboardingScreen