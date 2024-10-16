import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly


const HomeKnowleadScreen = () => {
    const { theme } = useTheme(); // Accessing the theme and toggle function

    return (
        <SafeAreaView
            className='flex-1 justify-center items-center'
            style={{ backgroundColor: theme.backgroundColor }}
        >
            <Text className='text-primary text-4xl'>หน้าหลัก คลังความรู้</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Ticket')}>
                <Text>wxjsjsjs</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default HomeKnowleadScreen