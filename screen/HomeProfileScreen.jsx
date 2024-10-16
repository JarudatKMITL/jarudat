import React, { useContext } from 'react';
import { View, SafeAreaView, Button, TouchableOpacity, Switch, StatusBar, ScrollView } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly
import { AuthContext } from "../navigations/AuthProvider";

const HomeProfileScreen = () => {
  const { theme, toggleColorScheme, colorScheme } = useTheme(); // Accessing the theme and toggle function
  const { user } = useContext(AuthContext);

  return (
    <ScrollView className='flex-1 ' style={{ backgroundColor: theme.backgroundColor }}>

      <View className='ml-5'>
        <View className='flex-row mt-5 '>
          <Avatar.Image
            source={{
              uri: user.photoURL,
            }}
            size={80}
          />
          <View className='ml-5'>
            <Title
              className='mt-3 text-2xl font-SemiBold  '
              style={{ color: theme.textColor }}>
              Jarudat chaikuad
            </Title>
            <Caption className='text-lg'
              style={{ color: theme.textColor }} >
              @admin IT
            </Caption>
          </View>
        </View>
      </View>

      <View className='mt-8 ml-5'>
        <View className='flex-row mb-1'>
          <Icon name="home-variant" color={theme.textColor} size={25} />
          <Text className='font-Light text-[16px] ml-3' style={{ color: theme.textColor }}> Company : Supornchai</Text>
        </View>

        <View className='flex-row mb-1'>
          <Icon name="phone" color={theme.textColor} size={25} />
          <Text className='font-Light text-[16px] ml-3' style={{ color: theme.textColor }}> 0830625832</Text>
        </View>

        <View className='flex-row'>
          <Icon name="email" color={theme.textColor} size={25} />
          <Text className='font-Light text-[16px] ml-3' style={{ color: theme.textColor }}> jarudat.jc@gmail.com</Text>
        </View>
      </View>


      <View className='border-b-2 border-t-2 flex-row h-24 mt-10'
      style={{borderBlockColor:theme.textColor}}>
        <View className='w-[50%] items-center justify-center border-r-2' 
        style={{borderRightColor:theme.textColor}}>
          <Title>₹140.50</Title>
          <Caption>Wallet</Caption>
        </View>
        <View className='w-[50%] items-center justify-center' >
          <Title>12</Title>
          <Caption>Orders</Caption>
        </View>
      </View>


      <View className='ml-5'>
        <TouchableOpacity onPress={() => { }}>
          <View className='flex-row mt-10 mb-2'>
            <Icon1 name="settings-outline" color={theme.iconProfile} size={30} />
            <Text
              className='font-SemiBold text-[21px] ml-3'
              style={{ color: theme.textColor }}>
              Account Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View className='flex-row  mb-2'>
            <Icon1 name="settings-outline" color={theme.iconProfile} size={30} />
            <Text
              className='font-SemiBold text-[21px] ml-3'
              style={{ color: theme.textColor }}>
              Usage History
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View className='flex-row  mb-2'>
            <Icon1 name="settings-outline" color={theme.iconProfile} size={30} />
            <Text
              className='font-SemiBold text-[21px] ml-3'
              style={{ color: theme.textColor }}>
              Support
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View className='flex-row mb-2 '>
            <Icon1 name="settings-outline" color={theme.iconProfile} size={30} />
            <Text
              className='font-SemiBold text-[21px] ml-3'
              style={{ color: theme.textColor }}>
              Notification Preferences
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleColorScheme} >
          <View className='flex-row mb-2 '>
            <Icon1 name="settings-outline" color={theme.iconProfile} size={30} />
            <Text
              className='font-SemiBold text-[21px] ml-3'
              style={{ color: theme.textColor }}>
              Dark Mode
            </Text>

            <Switch
              className='ml-5'
              value={colorScheme === 'dark'} // แสดงสถานะตามธีมปัจจุบัน
              onValueChange={toggleColorScheme} // เมื่อกดจะสลับธีม
              trackColor={{ false: '#767577', true: '#81b0ff' }} // เปลี่ยนสีของ track
              thumbColor={colorScheme === 'dark' ? '#FFD369' : '#f4f3f4'} // เปลี่ยนสีของ thumb
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // เพิ่มขนาดปุ่ม
            />

          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View className='flex-row  '>
            <Icon1 name="settings-outline" color={theme.iconProfile} size={30} />
            <Text
              className='font-SemiBold text-[21px] ml-3'
              style={{ color: theme.textColor }}>
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>













    </ScrollView>
  );
};

export default HomeProfileScreen;
