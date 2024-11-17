import React, { useState, useEffect } from 'react';
import { View , ActivityIndicator} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screen/SignUpScreen';
import LoginScreen from '../screen/LoginScreen';
import OnboardingScreen from '../screen/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLoginScreen from '../screen/HomeLoginScreen';
import ResetPasswordScreen from '../screen/ResetPasswordScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import CustomLoading from '../components/CustomLoading';



const Stack = createStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched');
        if (value === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.log('Error accessing AsyncStorage:', error);
        setIsFirstLaunch(false); // fallback ค่า default
      }
    };

    checkFirstLaunch();

    GoogleSignin.configure({
      webClientId: '941923011037-1v13bj71v61bm5c7notm8oalbmq88h82.apps.googleusercontent.com',
    });
  }, []);

  if (isFirstLaunch === null) {
    return (
      <CustomLoading/>
    );
  }

  else if (isFirstLaunch == true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'HomeLogin';
  }

  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="HomeLogin"
        component={HomeLoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ header: () => null }}

      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ header: () => null }}

      />
    </Stack.Navigator>
  );
};

export default AuthStack;