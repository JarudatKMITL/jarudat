import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { AuthContext } from "../navigations/AuthProvider";
import ForgetIcon from '../assets/images/forgot.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const { resetPassword } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <ForgetIcon width={wp('55%')} height={hp('30%')} />
            </View>

            <Text style={styles.title}>Forget</Text>
            <Text style={styles.title}>Password?</Text>

            <View style={styles.inputContainer}>
                <Ionicons name={"mail-outline"} size={30} color={'#AEB5BB'} />
                <TextInput
                    style={styles.inputText}
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity
                onPress={() => resetPassword(email)}
                style={styles.resetButton}
            >
                <Text style={styles.resetButtonText}>Send Reset Email</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don’t have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#e5eff8',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('5%'),
    },
    title: {
        fontSize: wp('10%'),
        fontWeight: 'bold',
        color: '#45484A',
        marginBottom: hp('1%'),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#AEB5BB',
        marginVertical: hp('3%'),
        paddingHorizontal: wp('2%'),
    },
    inputText: {
        flex: 1,
        fontSize: wp('4.5%'),
        marginLeft: wp('2%'),
        color: '#45484A',
        fontWeight: '500',
    },
    resetButton: {
        backgroundColor: '#45484A',
        borderRadius: wp('5%'),
        marginVertical: hp('2%'),
        paddingVertical: hp('1.5%'),
    },
    resetButtonText: {
        fontSize: wp('5%'),
        color: 'white',
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
        marginRight: wp('1%'),
    },
    loginText: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
});
