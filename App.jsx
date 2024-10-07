import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';
import HomeLoginScreen from './screen/HomeLoginScreen';
import LoginScreen from './screen/LoginScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  return (
    <LoginScreen/>

   


  )
}

export default App

