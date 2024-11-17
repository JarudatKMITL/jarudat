import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, Alert, SafeAreaView, StyleSheet } from 'react-native';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../navigations/AuthProvider";
import Icon from 'react-native-vector-icons/FontAwesome'; // for Facebook icon
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // for Twitter icon
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LoginScreen = ({ navigation }) => {
  const [secureEntery, setSecureEntery] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { login, googleLogin, fbLogin } = useContext(AuthContext);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Login Error", "Please enter both email and password.");
    } else {
      login(email, password);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeLogin')}
        style={styles.backButton}>
        <Ionicons name={"arrow-back-outline"} size={25} color={'#45484A'} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.appNameText}>IT Helpdesk</Text>
        <Text style={styles.companyText}>Jarudat</Text>
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
            autoCapitalize="none"
            autoCorrect={false}
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
            secureTextEntry={secureEntery}
          />
          <TouchableOpacity onPress={() => setSecureEntery(prev => !prev)}>
            <SimpleLineIcons name={"eye"} size={20} color={'#AEB5BB'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orContinueText}>or continue with</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => googleLogin()}>
            <Image source={require("../assets/images/google.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={() => fbLogin()}>
            <Icon name="facebook" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.twitterButton]} onPress={() => { Alert.alert('ยังไม่ทำ') }}>
            <MaterialCommunityIcons name="twitter" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.noAccountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5eff8',
    padding: wp('5%'),
    paddingBottom: hp('5%'), // เพิ่มระยะห่างจากด้านล่าง
    //marginTop: hp('5%'),
  },
  // ส่วนอื่น ๆ ของสไตล์ยังคงเหมือนเดิม

  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    backgroundColor: 'gray',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  welcomeText: {
    fontSize: wp('8%'),
    color: '#45484A',
    fontWeight: '600',
  },
  appNameText: {
    fontSize: wp('8%'),
    color: '#FFA500',
    fontWeight: '600',
  },
  companyText: {
    fontSize: wp('8%'),
    color: '#45484A',
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: hp('2%'),
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
    marginLeft:8,
    color: '#45484A',
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: '#45484A',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginVertical: hp('1%'),
    paddingRight: wp('2%'),
  },
  loginButton: {
    backgroundColor: '#45484A',
    borderRadius: wp('5%'),
    marginTop: hp('3%'),
    paddingVertical: hp('1.5%'),
  },
  loginButtonText: {
    color: 'white',
    fontSize: wp('5%'),
    fontWeight: '600',
    textAlign: 'center',
  },
  orContinueText: {
    textAlign: 'center',
    fontSize: wp('4.5%'),
    marginVertical: hp('2%'),
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('5%'),
  },
  socialButton: {
    backgroundColor: 'white',
    padding: wp('4%'),
    borderRadius: wp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('16%'),
    height: wp('16%'),
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  socialIcon: {
    width: wp('8%'),
    height: wp('8%'),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  noAccountText: {
    fontSize: wp('5%'),
    marginRight: wp('2%'),
  },
  signupText: {
    fontSize: wp('5%'),
    fontWeight: '700',
  },
});
