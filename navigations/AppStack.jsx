import React, { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/HomeScreen';
import CustomDrawer from '../components/CustomDrawer';
import HomeTicketScreen from '../screen/HomeTicketScreen';
import HomeCreacteTicket from '../screen/HomeCreacteTicket';
import HomeKnowleadScreen from '../screen/HomeKnowleadScreen';
import HomeProfileScreen from '../screen/HomeProfileScreen';
import { useTheme } from '../components/ThemeContext';
import EditProfileScreen from '../screen/EditProfileScreen';

// สร้าง Stack Navigators เดิมแต่ละอันเพื่อคงฟังก์ชันการทำงานทั้งหมด
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Home1"
            component={HomeScreen}
            options={{
                headerTitle: 'Home',
                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={25}
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

const TicketStack = ({ navigation }) => {
    const { theme } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#06141B' },
            }}
        >
            <Stack.Screen
                name="Ticket1s"
                component={HomeTicketScreen}
                options={{
                    headerTitle: 'Tickets',
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Icon.Button
                                name="menu"
                                size={25}
                                backgroundColor="#06141B"
                                color="yellow"
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                }}
            />
        </Stack.Navigator>
    )
};


const CreateTicketStack = ({ navigation }) => {
    const { theme } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.backgroundColor },
            }}
        >
            <Stack.Screen
                name="CreateTicket1"
                component={HomeCreacteTicket}
                options={{
                    headerTitle: 'Create Ticket',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: theme.textColor,
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Ionicons.Button
                                name="menu"
                                size={25}
                                backgroundColor={theme.backgroundColor}
                                color={theme.textColor}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                }}
            />

        </Stack.Navigator>
    )
};




const KnowledgeStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Knowledge1"
            component={HomeKnowleadScreen}
            options={{
                headerTitle: 'Knowledge',
                headerLeft: () => (
                    <View style={{ marginLeft: 10 }}>
                        <Icon.Button
                            name="menu"
                            size={25}
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

const ProfileStack = ({ navigation }) => {
    const { theme } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.backgroundColor },
            }}
        >
            <Stack.Screen
                name="Profile1"
                component={HomeProfileScreen}
                options={{
                    headerTitle: 'Your Profile',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: theme.textColor,
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Icon.Button
                                name="menu"
                                size={25}
                                backgroundColor={theme.backgroundColor}
                                color={theme.textColor}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{ marginLeft: 10 }}>
                            <MaterialCommunityIcons.Button
                                name="account-edit"
                                size={25}
                                backgroundColor={theme.backgroundColor}
                                color={theme.textColor}
                                onPress={() => navigation.navigate('EditProfile')}
                            />
                        </View>
                    ),
                }}
            />

            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                    headerTitle: 'Edit Profile',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: theme.textColor,
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Ionicons.Button
                                name="arrow-back"
                                size={25}
                                backgroundColor={theme.backgroundColor}
                                color={theme.textColor}
                                onPress={() => navigation.navigate('Profile1')}
                            />
                        </View>
                    ),

                }}
            />
        </Stack.Navigator>
    );
};

// สร้าง Drawer Navigator รวม Stack ทั้งหมด
const AppDrawer = () => (
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
        }}
    >
        <Drawer.Screen
            name="Home"
            component={HomeStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="Tickets"
            component={TicketStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="newspaper-outline" size={22} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="CreateTicket"
            component={CreateTicketStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="create-outline" size={22} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="Knowledge"
            component={KnowledgeStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="school-outline" size={22} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="Profile"
            component={ProfileStack}
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="person-outline" size={22} color={color} />
                ),
            }}
        />
    </Drawer.Navigator>
);

export default AppDrawer;
