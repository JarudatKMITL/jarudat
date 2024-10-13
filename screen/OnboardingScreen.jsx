import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import { Image } from 'react-native-svg';

const OnboardingScreen = ({navigation}) => {
  return (
    <Onboarding
      onSkip={() => navigation.navigate("HomeLogin")}
      onDone={() => navigation.navigate("HomeLogin")}
      
      pages={[
        {
          backgroundColor: '#FF12a1',
          image: <Image source={require('../assets/images/user-profile.jpg')}  />,
          title: 'On1',
          subtitle:'Done whit React',
        },
        {
          backgroundColor: '#454321',
          image: <Image source={require('../assets/images/drawer-bg.jpeg')}  />,
          title: 'On2',
          subtitle:'Done whit React',
        },
        {
          backgroundColor: '#fda421',
          image: <Image source={require('../assets/images/drawer-bg.jpeg')}  />,
          title: 'On2',
          subtitle:'Done whit React',
        },
        {
          backgroundColor: '#994321',
          image: <Image source={require('../assets/images/drawer-bg.jpeg')}  />,
          title: 'On2',
          subtitle:'Done whit React',
        },
      ]}
    />
  )
}

export default OnboardingScreen