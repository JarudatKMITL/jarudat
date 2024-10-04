import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/HomeScreen';
import OnboardingScreen from '../screen/OnboardingScreen';
import CustomDrawer from '../components/CustomDrawer';
import Report from '../screen/Report';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Drawer = createDrawerNavigator();

const AppStack = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: '#aa18ea',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {
                    marginLeft: -20,
                    fontFamily: 'Anakotmai-Medium',
                    fontSize: 15,
                },
            }} >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                }} />
            <Drawer.Screen 
            name="Report" 
            component={Report} 
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="construct-outline" size={22} color={color} />
                ),
            }} />
        </Drawer.Navigator>
    )
}

export default AppStack