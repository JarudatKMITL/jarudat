import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, Image,Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../navigations/AuthProvider";

const SignUpScreen = ({ navigation }) => {
    const [secureEntery, setSecureEntery] = useState(true);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const { register } = useContext(AuthContext);
    const handleSignUp = () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        register(email, password)
    }
    
    return (
        <SafeAreaView className='bg-bgblue flex-1 p-5'>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className='w-10 h-10 bg-gray rounded-full justify-center items-center '>
                <Ionicons name={"arrow-back-outline"} size={25} color={'#45484A'} />
            </TouchableOpacity>
            <View className='my-5  '>
                <Text className='text-4xl text-primary font-SemiBold m-1'>Let's get</Text>
                <Text className='text-4xl text-primary font-SemiBold m-1'>started</Text>
            </View>
            <View className='mt-10' >
                <View className='border-2 border-accent rounded-full  flex-row items-center p-2  my-2 pl-6' >
                    <Ionicons name={"mail-outline"} size={30} color={'#AEB5BB'} />
                    <TextInput
                        className='flex-1 px-4 font-Light text-lg  '
                        value={email}
                        onChangeText={(userEmail) => setEmail(userEmail)}
                        placeholder="Enter your email"
                        placeholderTextColor={'#AEB5BB'}
                        keyboardType="email-address"
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
                <View className='border-2 border-accent rounded-full  flex-row items-center p-2  my-1 pl-6 pr-8'>
                    <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
                    <TextInput
                        className='flex-1 px-4 font-Light text-lg '
                        value={confirmPassword}
                        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
                        placeholder="Confirm your password"
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
                    className='bg-primary rounded-full mt-20'
                    onPress={handleSignUp}
                >
                    <Text className='text-white text-[20px] font-SemiBold text-center p-5 '>Signup</Text>
                </TouchableOpacity>
                <View className=' flex-row py-5 justify-center'>
                    <Text className='text-[20px] mr-2'>Don’t have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}>
                        <Text className='text-[20px] font-Bold'>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignUpScreen