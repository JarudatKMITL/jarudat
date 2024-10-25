import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '@react-native-firebase/firestore';
import { AuthContext } from '../navigations/AuthProvider.android';
import { UserContext } from '../api/UserContext';


const UserTicketScreen = () => {
  const {user} = useContext(AuthContext);
  const { role, email } = useContext(UserContext);



  


  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
        <Text className='text-2xl'>User</Text>
    </SafeAreaView>
  )
}

export default UserTicketScreen