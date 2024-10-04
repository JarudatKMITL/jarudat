import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screen/HomeScreen';
import OnboardingScreen from '../screen/OnboardingScreen';



const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
        <Stack.Screen name="Onboarding" component={OnboardingScreen}  />
        <Stack.Screen name="Home" component={HomeScreen}   />
    </Stack.Navigator>
  )
}

export default AuthStack