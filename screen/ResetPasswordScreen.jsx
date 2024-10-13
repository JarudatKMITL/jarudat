import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { AuthContext } from "../navigations/AuthProvider";
import ForgetIcon from '../assets/images/forgot.svg'
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const { resetPassword } = useContext(AuthContext);

    return (
        <View className='flex-1 p-5 bg-bgblue'>
            <View className='justify-center items-center m-10'>
                <ForgetIcon widht={220} height={220} />
            </View>
            <Text className='text-5xl font-Bold my-3 '>Forget</Text>
            <Text className='text-5xl font-Bold mt-2 '>Password?</Text>
            <View className='flex-row border-b-2 border-accnet my-5 items-center mb-10 mx-2'>
                <Ionicons name={"mail-outline"} size={30} color={'#AEB5BB'} />
                <TextInput
                    className='flex-row font-Medium text-lg ml-3 mt-2 '
                    placeholder="Enter your email address         "
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity
                onPress={() => resetPassword(email)}
                className='bg-primary rounded-full '
            >
                <Text className='text-[20px] font-SemiBold text-white text-center p-4  '>Send Reset Email</Text>
            </TouchableOpacity>
            <View className=' flex-row py-5 justify-center'>
                <Text className='text-[20px] mr-2'>Don’t have an account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text className='text-[20px] font-Bold'>Login</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

export default ResetPasswordScreen;