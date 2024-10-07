import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput ,Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';


const LoginScreen = ({navigation}) => {
  const [secureEntery, setSecureEntery] = useState(true);

  

  return (
    <SafeAreaView className='bg-bgblue flex-1 p-5'>
      <TouchableOpacity className='w-10 h-10 bg-gray rounded-full justify-center items-center '>
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
            placeholder="Enter your email"
            placeholderTextColor={'#AEB5BB'}
            keyboardType="email-address"
          />
        </View>
        <View className='border-2 border-accent rounded-full  flex-row items-center p-2  my-1 pl-6 pr-8'>
          <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
          <TextInput
            className='flex-1 px-4 font-Light text-lg '
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
        <TouchableOpacity >
          <Text className='text-right my-3 text-primary font-SemiBold pr-4 text-[16px] ' >Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity className='bg-primary rounded-full mt-5'>
          <Text className='text-white text-[20px] font-SemiBold text-center p-4 '>Login</Text>
        </TouchableOpacity>
        <Text >or continue with</Text>
        <TouchableOpacity >
          <Image
            source={require("../assets/images/google.png")}
            className='w-8 h-8'
          />
          <Text >Google</Text>
        </TouchableOpacity>
        <View >
          <Text >Don’t have an account?</Text>
          <TouchableOpacity >
            <Text >Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen