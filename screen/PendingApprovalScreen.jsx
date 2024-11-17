import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from "../navigations/AuthProvider";
import CustomLoading from '../components/CustomLoading';

const PendingApprovalScreen = () => {
  const { logout } = useContext(AuthContext);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let lastVerifiedState = null;

    const checkEmailVerification = async () => {
      try {
        const user = auth().currentUser;

        if (!user) {
          Alert.alert('Error', 'No user logged in. Please log in again.');
          logout();
          return;
        }

        await user.reload();
        const isVerified = user.emailVerified;

        if (lastVerifiedState !== isVerified) {
          console.log('Firebase emailVerified:', isVerified);
          lastVerifiedState = isVerified;
        }

        setEmailVerified(isVerified);

        if (isVerified) {
          const userDocRef = firestore().collection('users').doc(user.email);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const firestoreData = userDoc.data();

            if (firestoreData.emailVerified !== isVerified) {
              console.log('Updating Firestore: emailVerified = true...');
              await userDocRef.update({ emailVerified: true });
              console.log('Firestore updated successfully.');
            }
          } else {
            console.log('Firestore document does not exist.');
          }
        }
      } catch (error) {
        console.log('Error checking email verification:', error);
      }
      setLoading(false);
    };

    checkEmailVerification();

    const interval = setInterval(() => {
      checkEmailVerification();
    }, 5000);

    return () => clearInterval(interval);
  }, [logout]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const resendVerificationEmail = async () => {
    try {
      const user = auth().currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is logged in. Please log in again.');
        return;
      }

      if (timer > 0) {
        Alert.alert('Please Wait', `You can resend the email in ${timer} seconds.`);
        return;
      }

      await user.sendEmailVerification();

      Alert.alert('Success', 'Verification email sent. Please check your inbox.');
      setTimer(60);
    } catch (error) {
      console.log('Resend Email Error:', error.message || error.code || error);

      if (error.code === 'auth/too-many-requests') {
        Alert.alert('Error', 'You have sent too many requests. Please wait a while before trying again.');
      }
    }
  };

  if (loading) {
    return (
        <CustomLoading/>
    );
  }

  if (!emailVerified) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../assets/email-verification.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.title}>ยืนยันอีเมลของคุณ</Text>
        <Text style={styles.message}>
          เราได้ส่งอีเมลยืนยันไปที่ {auth().currentUser?.email}
        </Text>
        <TouchableOpacity
          style={[styles.button, timer > 0 && styles.buttonDisabled]}
          onPress={resendVerificationEmail}
          disabled={timer > 0}
        >
          <Text style={styles.buttonText}>
            {timer > 0 ? `รอ ${timer} วินาที` : 'ส่งอีเมลอีกครั้ง'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/pending-approval.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>บัญชีของคุณอยู่ระหว่างรอการอนุมัติ</Text>
      <Text style={styles.message}>
        โปรดรอให้แอดมินตรวจสอบและอนุมัติบัญชีของคุณ
      </Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c63ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6c63ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
});

export default PendingApprovalScreen;
