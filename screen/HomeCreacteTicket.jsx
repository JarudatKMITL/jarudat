import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeCreacteTicket = () => {
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-primary text-4xl'>หน้าหลัก สร้างคำขอใหม่</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Ticket')}>
        <Text>wxjsjsjs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeCreacteTicket