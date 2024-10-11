import React,{useContext} from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from "../navigations/AuthProvider";


const HomeScreen = ({navigation}) => {
  const { logout,user } = useContext(AuthContext);

  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Text className='text-primary text-4xl'>หน้าหลัก Userhihuh</Text>
      <Text>{user.uid}</Text>
      <TouchableOpacity onPress={(logout )}>
        <Text>Loginout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeScreen

