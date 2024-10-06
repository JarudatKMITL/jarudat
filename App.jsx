import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './navigations/AuthStack';
import AppStack from './navigations/AppStack';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  return (
    <NavigationContainer>
      <AppStack/>
    </NavigationContainer>

   


  )
}

export default App

