import React from 'react'
import { View, Text, TouchableOpacity ,StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const HomeScreen = () => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-white'>
      <View>
        <Text className='text-2xl font-primaryBold'>
          HOME Game
        </Text>
        <Text className='text-2xl font-primaryLight'>
          HOME Game
        </Text>
        <Text className='text-2xl font-primaryMedium'>
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

export default HomeScreen

