import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const HomeLoginScreen = ({ navigation }) => {
    return (
        <View className="flex-1  items-center bg-bgblue">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#e5eff8"
            />
            <Image source={require("../assets/images/logo.png")} className="h-10 w-36 my-5" />
            <Image source={require("../assets/images/man.png")} className="h-64 w-60 my-5" />
            <Text className="text-4xl font-Bold text-center text-[#45484A] mt-10 py-5">Lorem ipsum doler.</Text>
            <Text className="my-10 text-lg px-5 text-center text-accent font-Medium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore
            </Text>
            <View className="mt-10 flex-row border-primary border-2 w-[70%] h-16 rounded-full">
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    className='justify-center items-center w-[50%]  bg-[#45484A] rounded-full'>
                    <Text className='text-white text-lg font-SemiBold'>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')} 
                    className='justify-center items-center w-[50%]  '>
                    <Text className='text-[#45484A] text-lg font-SemiBold'>Sign-up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeLoginScreen