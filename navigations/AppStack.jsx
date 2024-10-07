import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native';

import HomeScreen from '../screen/HomeScreen';
import CustomDrawer from '../components/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeTicketScreen from '../screen/HomeTicketScreen';
import HomeCreacteTicket from '../screen/HomeCreacteTicket';
import HomeKnowleadScreen from '../screen/HomeKnowleadScreen';
import HomeProfileScreen from '../screen/HomeProfileScreen';
import HomeLoginScreen from '../screen/HomeLoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeDrawer = ({ navigation }) => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#06141B',
            drawerActiveTintColor: 'yellow',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                marginLeft: -20,
                fontFamily: 'Anakotmai-Medium',
                fontSize: 15,
            },
        }}>
        <Drawer.Screen
            name="Home"
            component={HomeStack}
        />
    </Drawer.Navigator>
);
const TicketDrawer = ({ navigation }) => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#06141B',
            drawerActiveTintColor: 'yellow',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                marginLeft: -20,
                fontFamily: 'Anakotmai-Medium',
                fontSize: 15,
            },
        }}>
        <Drawer.Screen
            name="Tickets"
            component={TicketStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />
                ),
            }}
        />
        
    </Drawer.Navigator>
);
const CreateTicketDrawer = ({ navigation }) => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#06141B',
            drawerActiveTintColor: 'yellow',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                marginLeft: -20,
                fontFamily: 'Anakotmai-Medium',
                fontSize: 15,
            },
        }}>
        <Drawer.Screen
            name="CreateTicket"
            component={CreateTicketStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />
                ),
            }}
        />
        
    </Drawer.Navigator>
);
const KnowledgeDrawer = ({ navigation }) => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#06141B',
            drawerActiveTintColor: 'yellow',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                marginLeft: -20,
                fontFamily: 'Anakotmai-Medium',
                fontSize: 15,
            },
        }}>
        <Drawer.Screen
            name="Knowlead"
            component={KnowledgeStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />
                ),
            }}
        />
        
    </Drawer.Navigator>
);
const ProfileDrawer = ({ navigation }) => (
    <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#06141B',
            drawerActiveTintColor: 'yellow',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                marginLeft: -20,
                fontFamily: 'Anakotmai-Medium',
                fontSize: 15,
            },
        }}>
        <Drawer.Screen
            name="Profile"
            component={ProfileStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />
                ),
            }}
        />
        
    </Drawer.Navigator>
);

const HomeStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
            headerShown: true,
            
        }}
    >
        <Stack.Screen
            name="HomeStack"
            component={HomeScreen}
            options={{
                headerTitle: 'My Screen ',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },
            }}
        />
        <Stack.Screen
            name="loginHome"
            component={HomeLoginScreen}
            options={{
                headerShown:false,
                headerTitle: 'My Screen ',
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },

                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={22}
                            backgroundColor="#06141B"
                            color="yellow"
                            onPress={() => navigation.openDrawer()}
                        />
                    </View>
                ),
            }}
        />
        
    </Stack.Navigator>
);
const TicketStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Tickets"
            component={HomeTicketScreen}
            options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },

                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={22}
                            backgroundColor="#06141B"
                            color="yellow"
                            onPress={() => navigation.openDrawer()}
                        />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>

);
const CreateTicketStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Creact Ticket"
            component={HomeCreacteTicket}
            options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },

                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={22}
                            backgroundColor="#06141B"
                            color="yellow"
                            onPress={() => navigation.openDrawer()}
                        />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>

);
const KnowledgeStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Knowlead Base"
            component={HomeKnowleadScreen}
            options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },

                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={22}
                            backgroundColor="#06141B"
                            color="yellow"
                            onPress={() => navigation.openDrawer()}
                        />
                    </View>
                ),
            }}
        />
        
    </Stack.Navigator>

);
const ProfileStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Profile"
            component={HomeProfileScreen}
            options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    color: '#fff',
                    fontFamily: 'Kufam-SemiBoldItalic',
                    fontSize: 18,
                },

                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={22}
                            backgroundColor="#06141B"
                            color="yellow"
                            onPress={() => navigation.openDrawer()}
                        />
                    </View>
                ),
            }}
        />
    </Stack.Navigator>

);



const AppStack = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: { backgroundColor: '#AD40AF' },
                tabBarActiveTintColor: 'yellow',
                tabBarInactiveTintColor: '#FFF',
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: '#06141B',
                    height: 80,

                },
                tabBarLabelStyle: {
                    fontSize: 12, // ปรับขนาดฟอนต์ที่นี่
                    marginBottom: 10,
                    fontFamily: 'Anakotmai-Madium',
                    fontWeight: 'bold'

                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeDrawer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Ticket"
                component={TicketDrawer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="newspaper-outline" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="CreateTicket"
                component={CreateTicketDrawer}
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="create-outline" color='#F46C3F' size={50} />
                    )
                }}
            />
            <Tab.Screen
                name="Knowlead"
                component={KnowledgeDrawer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="school-outline" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileDrawer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default AppStack