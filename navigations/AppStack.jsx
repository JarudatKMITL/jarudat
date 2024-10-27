import React, { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/HomeScreen';
import CustomDrawer from '../components/CustomDrawer';
import HomeCreacteTicket from '../screen/HomeCreacteTicket';
import HomeKnowleadScreen from '../screen/HomeKnowleadScreen';
import HomeProfileScreen from '../screen/HomeProfileScreen';
import { useTheme } from '../components/ThemeContext';
import EditProfileScreen from '../screen/EditProfileScreen';
import { UserContext } from '../api/UserContext';
import AdminTicketScreen from '../screen/AdminTicketScreen';
import UserTicketScreen from '../screen/UserTicketScreen';
import TicketOpen from '../ticketAllScreen/TicketOpenAdmin';



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
    const { role, loading } = useContext(UserContext); // ดึงข้อมูล role และ loading จาก context

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.textColor} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.backgroundColor },
            }}
        >
            {role === 'admin' ? (
                // ถ้า role เป็น admin, แสดงหน้า AdminTicketScreen
                <Stack.Screen
                    name="AdminTicket"
                    component={AdminTicketScreen}
                    options={{
                        headerTitle: 'Ticket',
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
                    }}
                />
            ) : (
                // ถ้า role เป็น user, แสดงหน้า UserTicketScreen
                <Stack.Screen
                    name="UserTickets"
                    component={UserTicketScreen}
                    options={{
                        headerTitle: 'Ticket',
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
                    }}
                />
            )}

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
                                name="arrow-back"
                                size={25}
                                backgroundColor={theme.backgroundColor}
                                color={theme.textColor}
                                onPress={() => navigation.navigate(role === 'admin' ? 'AdminTicket' : 'UserTickets')}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="TicketsOpen"
                component={TicketOpen}
                options={{
                    headerTitle: 'My tickets open',
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
                                onPress={() => navigation.navigate(role === 'admin' ? 'AdminTicket' : 'UserTickets')}
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
            name="HomeStack"
            component={HomeStack}
            options={{
                drawerLabel: "Home",
                drawerIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={22} color={color} />
                ),
                // ใช้ listener เพื่อรีเซ็ตสแต็กไปที่หน้าหลักของ HomeStack
                listeners: ({ navigation }) => ({
                    drawerItemPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'HomeStack' }],
                            })
                        );
                    },
                }),
            }}
        />
        <Drawer.Screen
            name="TicketStack"
            component={TicketStack}
            options={{
                drawerLabel: "Tickets",
                drawerIcon: ({ color }) => (
                    <Ionicons name="newspaper-outline" size={22} color={color} />
                ),
                // ใช้ listener เพื่อรีเซ็ตสแต็กไปที่หน้าหลักของ TicketStack
                listeners: ({ navigation }) => ({
                    drawerItemPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'TicketStack' }],
                            })
                        );
                    },
                }),
            }}
        />
        <Drawer.Screen
            name="KnowledgeStack"
            component={KnowledgeStack}
            options={{
                drawerLabel: "Knowledge",
                drawerIcon: ({ color }) => (
                    <Ionicons name="school-outline" size={22} color={color} />
                ),
                listeners: ({ navigation }) => ({
                    drawerItemPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'KnowledgeStack' }],
                            })
                        );
                    },
                }),
            }}
        />
        <Drawer.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
                drawerLabel: "Profile",
                drawerIcon: ({ color }) => (
                    <Ionicons name="person-outline" size={22} color={color} />
                ),
                listeners: ({ navigation }) => ({
                    drawerItemPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'ProfileStack' }],
                            })
                        );
                    },
                }),
            }}
        />
    </Drawer.Navigator>
);

export default AppDrawer;
