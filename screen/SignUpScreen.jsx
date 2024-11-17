import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    StyleSheet,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../navigations/AuthProvider";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SignUpScreen = ({ navigation }) => {
    const [secureEntry, setSecureEntry] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            await register(email, password); // ฟังก์ชันการสมัครสมาชิก
        } catch (e) {
            //Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

   

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.backButton}>
                <Ionicons name={"arrow-back-outline"} size={25} color={'#45484A'} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Let's get</Text>
                <Text style={styles.headerText}>started</Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.inputField}>
                    <Ionicons name={"mail-outline"} size={30} color={'#AEB5BB'} />
                    <TextInput
                        style={styles.inputText}
                        value={email}
                        onChangeText={(userEmail) => setEmail(userEmail)}
                        placeholder="Enter your email"
                        placeholderTextColor={'#AEB5BB'}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputField}>
                    <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
                    <TextInput
                        style={styles.inputText}
                        value={password}
                        onChangeText={(userPassword) => setPassword(userPassword)}
                        placeholder="Enter your password"
                        placeholderTextColor={'#AEB5BB'}
                        secureTextEntry={secureEntry}
                    />
                    <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                        <SimpleLineIcons name={"eye"} size={20} color={'#AEB5BB'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputField}>
                    <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
                    <TextInput
                        style={styles.inputText}
                        value={confirmPassword}
                        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
                        placeholder="Confirm your password"
                        placeholderTextColor={'#AEB5BB'}
                        secureTextEntry={secureEntry}
                    />
                    <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                        <SimpleLineIcons name={"eye"} size={20} color={'#AEB5BB'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handleSignUp}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.signupButtonText}>Signup</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don’t have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>

                
            </View>
        </SafeAreaView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5eff8',
        padding: wp('5%'),
        paddingBottom: hp('5%'), // เว้นระยะห่างจากด้านล่าง
    },
    backButton: {
        width: wp('10%'),
        height: wp('10%'),
        backgroundColor: 'gray',
        borderRadius: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginTop: hp('2%'),
    },
    headerText: {
        fontSize: wp('8%'),
        color: '#45484A',
        fontWeight: '600',
        marginBottom: hp('1%'),
    },
    inputContainer: {
        marginTop: hp('5%'),
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#AEB5BB',
        borderWidth: 2,
        borderRadius: wp('5%'),
        paddingHorizontal: wp('4%'),
        marginVertical: hp('1%'),
    },
    inputText: {
        flex: 1,
        fontSize: wp('4.5%'),
        marginLeft: 8,
        color: '#45484A',
    },
    signupButton: {
        backgroundColor: '#45484A',
        borderRadius: wp('5%'),
        marginTop: hp('5%'),
        paddingVertical: hp('1.5%'),
    },
    signupButtonText: {
        color: 'white',
        fontSize: wp('5%'),
        fontWeight: '600',
        textAlign: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: hp('3%'),
    },
    footerText: {
        fontSize: wp('4.5%'),
        marginRight: wp('2%'),
    },
    loginLink: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
    },

});
