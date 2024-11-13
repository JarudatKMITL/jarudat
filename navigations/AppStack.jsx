import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import HomeCreacteTicket from '../screen/HomeCreacteTicket';
import HomeKnowleadScreen from '../screen/HomeKnowleadScreen';
import HomeProfileScreen from '../screen/HomeProfileScreen';
import { useTheme } from '../components/ThemeContext';
import EditProfileScreen from '../screen/EditProfileScreen';
import { UserContext } from '../api/UserContext';
import AdminTicketScreen from '../screen/AdminTicketScreen';
import UserTicketScreen from '../screen/UserTicketScreen';
import TicketOpen from '../ticketAllScreen/TicketOpenAdmin';
import InProgressScreen from '../ticketAllScreen/InProgress';
import { DrawerHomeApp } from '../components/DrawerHome';
import ResolvedTickets from '../ticketAllScreen/ResolvedTickets';
import AllTickets from '../ticketAllScreen/ListTickets';
import SummaryTicket from '../ticketAllScreen/SummaryTicket';

// สร้าง Stack Navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Home
const HomeStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#06141B' },
        }}
    >
        <Stack.Screen
            name="Homestack"
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

// Stack Navigator for Tickets
const TicketStack = ({ navigation }) => {
    const { theme } = useTheme();
    const { role, loading } = useContext(UserContext);

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
                <Stack.Screen
                    name="AdminTicket"
                    component={AdminTicketScreen}
                    options={{
                        headerShown: false,
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
                name="TakeOwnership"
                component={TicketOpen}
                options={{
                    headerTitle: 'Take Ownership',
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
                name="InProgress"
                component={InProgressScreen}
                options={{
                    headerTitle: 'InProgress',
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
                name="Resolved"
                component={ResolvedTickets}
                options={{
                    headerTitle: 'Resoved Ticket',
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
                name="ListTickets"
                component={AllTickets}
                options={{
                    headerTitle: 'Resoved Ticket',
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
                name="SummaryTickets"
                component={SummaryTicket}
                options={{
                    headerTitle: 'SummaryTickets',
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
    );
};

// Stack Navigator for Knowledge
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

// Stack Navigator for Profile
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
                    //headerShown: false,
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

// Bottom Tab Navigator

const HomeDrawer = ({ navigation }) => (
    <Drawer.Navigator
        drawerContent={props => <DrawerHomeApp{...props} />}
        screenOptions={{
            headerShown: false,  // ซ่อน Header ของทุกหน้าจอที่อยู่ใน Drawer
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
        <Drawer.Screen name="Homedrawer" component={HomeStack} />
    </Drawer.Navigator>

);

// ใช้ Bottom Tab เป็นโครงสร้างหลักใน Drawer Navigator
const AppBottomTabs = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Tickets') {
                        iconName = 'newspaper-outline';
                    } else if (route.name === 'Knowledge') {
                        iconName = 'school-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    }

                    // เพิ่มแอนิเมชันการขยายของไอคอน
                    const animatedStyle = useAnimatedStyle(() => {
                        return {
                            transform: [{ scale: withTiming(focused ? 1.2 : 1, { duration: 200 }) }],
                        };
                    });

                    return (
                        <Animated.View style={animatedStyle}>
                            <Ionicons name={iconName} size={size} color={color} />
                        </Animated.View>
                    );
                },
                tabBarBackground: () => (
                    <LinearGradient
                        colors={[theme.tabBarBackgroundColor, theme.backgroundColor]}
                        style={{ flex: 1 }}
                    />
                ),
                tabBarActiveTintColor: theme.tabBarActiveTintColor,
                tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
                tabBarShowLabel: false, // ซ่อนชื่อของแท็บเพื่อให้ดูสะอาดขึ้น
                tabBarStyle: {
                    backgroundColor: theme.tabBarBackgroundColor, // พื้นหลังของแท็บ
                    borderTopWidth: 0, // ซ่อนขอบบนของแท็บ
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60, // เพิ่มความสูงของแท็บเพื่อให้ดูเด่น
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeDrawer} options={{ headerShown: false }} />
            <Tab.Screen name="Tickets" component={TicketStack} options={{ headerShown: false }} />
            <Tab.Screen name="Knowledge" component={KnowledgeStack} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};



export default AppBottomTabs


