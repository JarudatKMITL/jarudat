import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView} from 'react-native'
import React, { useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '@react-native-firebase/firestore';
import { AuthContext } from '../navigations/AuthProvider.android';
import { UserContext } from '../api/UserContext';
import { useTheme } from '../components/ThemeContext';


const AdminTicketScreen = () => {
  const { user } = useContext(AuthContext);
  const { role, email } = useContext(UserContext);
  const { theme } = useTheme();






  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.backgroundColor }}>
      {/* ส่วนหัว */}
      <View className="bg-blue-900 p-4 h-[100px] flex-row items-center justify-between mt-10 mx-7 rounded-3xl">
        <View className='flex-col'>
          <Text className="text-white text-lg font-bold">สวัสดี</Text>
          <Text className="text-white">คุณศิลปชัย สมชาย</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="ml-2">
            <Image
              source={require('../assets/images/man.png')} // ไอคอนผู้พิการ
              className="w-8 h-8"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Section */}
      <View className="mt-8">
        <View className="flex-row justify-between mx-10 ">
          {/* First Service Option */}
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>

          
        </View>
      </View>

      {/* Service Section */}
      <View className="mt-8">
        <View className="flex-row justify-between mx-10 ">
          {/* First Service Option */}
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>

          
        </View>
      </View>
{/* Service Section */}
<View className="mt-8">
        <View className="flex-row justify-between mx-10 ">
          {/* First Service Option */}
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>

          
        </View>
      </View>
      {/* Service Section */}
      <View className="mt-8">
        <View className="flex-row justify-between mx-10 ">
          {/* First Service Option */}
          <TouchableOpacity className="items-center w-[45%]  border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center w-[45%] border-red-500 border-2 p-4 rounded-2xl">
            <Image
              source={{ uri: 'https://kolsupport.wpenginepowered.com/wp-content/uploads/2019/06/Screen-Shot-on-2019-06-16-at-181842.png' }} // Replace with your service icon
              className="w-24 h-24 mb-2"
            />
            <Text className="text-center text-lg">สิทธิประโยชน์</Text>
          </TouchableOpacity>

          
        </View>
      </View>
      







    </ScrollView >
  )
}

export default AdminTicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#003c82', // Adjust color as needed
    borderRadius: 10,
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 14,
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  services: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  serviceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceItem: {
    alignItems: 'center',
    width: '45%',
  },
  serviceIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  serviceLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
});