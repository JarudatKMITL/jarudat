import { View, Text } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigation>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}  />
    </Stack.Navigation>
  )
}

export default AuthStack