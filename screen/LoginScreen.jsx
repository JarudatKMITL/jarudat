import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, Alert, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../navigations/AuthProvider";
import Icon from 'react-native-vector-icons/FontAwesome'; // for Facebook icon
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // for Twitter icon
const LoginScreen = ({ navigation }) => {
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { login, googleLogin, fbLogin } = useContext(AuthContext);

  const handleLogin = () => {
    if (!email || !password) {
      // หากฟิลด์อีเมลหรือรหัสผ่านว่าง แสดงแจ้งเตือน
      Alert.alert("Login Error", "Please enter both email and password.");
    } else {
      login(email, password); // เรียกฟังก์ชัน login ถ้าข้อมูลครบ

    }
  };


  return (
    <SafeAreaView className='bg-bgblue flex-1 p-5'>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeLogin')}
        className='w-10 h-10 bg-gray rounded-full justify-center items-center '>
        <Ionicons name={"arrow-back-outline"} size={25} color={'#45484A'} />
      </TouchableOpacity>
      <View className='my-5 items-center '>
        <Text className='text-4xl text-primary font-SemiBold m-1'>Wellcome</Text>
        <Text className='text-4xl font-SemiBold m-1 text-orange-400'>IT Helpdesk</Text>
        <Text className='text-4xl text-primary font-SemiBold m-1'>Jarudat</Text>
      </View>
      <View className='mt-5' >
        <View className='border-2 border-accent rounded-full  flex-row items-center p-2  my-2 pl-6' >
          <Ionicons name={"mail-outline"} size={30} color={'#AEB5BB'} />
          <TextInput
            className='flex-1 px-4 font-Light text-lg  '
            value={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            placeholder="Enter your email"
            placeholderTextColor={'#AEB5BB'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View className='border-2 border-accent rounded-full  flex-row items-center p-2  my-1 pl-6 pr-8'>
          <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
          <TextInput
            className='flex-1 px-4 font-Light text-lg '
            value={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholder="Enter your password"
            placeholderTextColor={'#AEB5BB'}
            secureTextEntry={secureEntery}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={'#AEB5BB'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text className='text-right my-3 text-primary font-SemiBold pr-4 text-[16px] ' >Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-primary rounded-full mt-5'
          onPress={handleLogin}
        >
          <Text className='text-white text-[20px] font-SemiBold text-center p-5 '>Login</Text>
        </TouchableOpacity>
        <Text className='text-center text-xl my-5 font-Medium' >or continue with</Text>

        <View className='flex-row justify-center items-center gap-6'>


          {/* Google Button */}
          <TouchableOpacity
            className='bg-white p-[16px] rounded-full  h-16 w-16 justify-center items-center  '
            onPress={() => googleLogin()}
          >
            <Image
              source={require("../assets/images/google.png")}
              className='w-[30px] h-[30px]'
            />
          </TouchableOpacity>

          {/* Facebook Button */}
          <TouchableOpacity
            className='bg-blue-600 p-[16px] rounded-full  h-16 w-16 justify-center items-center '
            onPress={() => fbLogin()}
          >
            <Icon name="facebook" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Twitter Button */}
          <TouchableOpacity
            className='bg-blue-400 p-[16px] rounded-full  h-16 w-16 justify-center items-center '
            onPress={() =>  {Alert.alert('ยังไม่ทำ')}}
            
          >
            <MaterialCommunityIcons name="twitter" size={24} color="#fff" />
          </TouchableOpacity>



        </View>

        <View className=' flex-row py-5 justify-center'>
          <Text className='text-[20px] mr-2'>Don’t have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
          >
            <Text className='text-[20px] font-Bold'>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen