import { View, Text, StatusBar, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeLoginScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#e5eff8"
            />

            {/* Logo Image */}
            <Image 
                source={require("../assets/images/logo.png")} 
                style={styles.logo} 
            />

            {/* Illustration Image */}
            <Image 
                source={require("../assets/images/man.png")} 
                style={styles.illustration} 
            />

            {/* Main Heading */}
            <Text style={styles.mainHeading}>
                Lorem ipsum doler.
            </Text>

            {/* Subtext */}
            <Text style={styles.subtext}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            </Text>

            {/* Button Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginButton}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')} 
                    style={styles.signupButton}>
                    <Text style={styles.signupText}>Sign-up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default HomeLoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between', 
        backgroundColor: '#e5eff8',
        padding: wp('4%'),
        paddingBottom: hp('5%'), 
    },
    logo: {
        height: hp('5%'),
        width: wp('36%'),
        marginVertical: hp('2%')
    },
    illustration: {
        height: hp('30%'),
        width: wp('60%'),
        marginVertical: hp('2%')
    },
    mainHeading: {
        fontSize: wp('8%'),
        fontWeight: 'bold',
        color: '#45484A',
        textAlign: 'center',
        marginTop: hp('3%'),
        paddingVertical: hp('1%')
    },
    subtext: {
        fontSize: wp('4.5%'),
        color: '#8c8c8c',
        textAlign: 'center',
        marginVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        fontWeight: '500'
    },
    buttonContainer: {
        flexDirection: 'row',
        borderColor: '#45484A',
        borderWidth: 2,
        width: wp('70%'),
        height: hp('8%'),
        borderRadius: hp('4%'),
        marginTop: hp('3%')
    },
    loginButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#45484A',
        borderRadius: hp('4%')
    },
    signupButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp('4%')
    },
    loginText: {
        fontSize: wp('4.5%'),
        color: 'white',
        fontWeight: '600'
    },
    signupText: {
        fontSize: wp('4.5%'),
        color: '#45484A',
        fontWeight: '600'
    }
});
