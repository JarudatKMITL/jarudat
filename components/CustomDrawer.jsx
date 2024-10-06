import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomDrawer = props => {
  return (
    <SafeAreaView className='flex-1 mb-16 '>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#1f212c'}}>
        <ImageBackground
          source={require('../assets/images/drawer-bg1.jpg')}
          className='p-5'>
          <Image
            source={require('../assets/images/user-profile.jpg')}
            className='h-20 w-20 rounded-full mb-3'
          />
          <Text className='text-white text-xl mb-1 font-primaryMedium' >
            Jarudat chaikuad
          </Text>
          <View className='flex-row'>
            <Text className='text-white mr-1 font-primaryLight text-base'>
              admin : IT
            </Text>
          </View>
        </ImageBackground>
        <View className='flex-1 bg-white pt-2 '>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="share-social-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer;