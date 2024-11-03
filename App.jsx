import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import Providers from './navigations';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';

firestore()
  .settings({
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  })
  .then(() => {
    return firestore().enablePersistence();
  })
  .then(() => {
    console.log("Offline persistence enabled");
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.log("The current environment does not support all of the features required to enable persistence");
    }
  });

const App = () => {
  const [isConnected, setIsConnected] = useState(null); // เริ่มต้นเป็น null เพื่อระบุสถานะเริ่มต้น
  const [showBanner, setShowBanner] = useState(false);
  const [shouldHideBanner, setShouldHideBanner] = useState(false); // ตัวแปรควบคุมการซ่อนแถบ

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      Alert.alert("Permission granted", "Thank you for enabling notifications!");
    } else {
      Alert.alert("Permission needed", "Please enable notifications to stay updated with alerts.");
    }
  };

  const getToken = async (user) => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        updateUserToken(user.email, fcmToken);
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  const updateUserToken = async (email, token) => {
    try {
      await firestore().collection("users").doc(email).set(
        {
          fcmToken: token,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving token to Firestore:", error);
    }
  };

  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: '1',
        channelName: 'test',
        channelDescription: 'test',
        importance: 4,
        vibrate: true,
      },
      //(created) => console.log(`createChannel returned '${created}'`)
    );
  };

  const foregroundNotificationListener = () => {
    messaging().onMessage(async (remoteMessage) => {
      PushNotification.localNotification({
        channelId: '1',
        title: remoteMessage.notification?.title || 'Notification',
        message: remoteMessage.notification?.body || 'You have a new message',
      });
    });
  };

  useEffect(() => {
    const setupFirestorePersistence = async () => {
      try {
        await firestore().settings({ cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED });
        await firestore().enablePersistence();
        console.log("Offline persistence enabled");
      } catch (err) {
        if (err.code === 'failed-precondition') {
          console.log("Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
          console.log("The current environment does not support all of the features required to enable persistence");
        }
      }
    };

    setupFirestorePersistence();

    const checkAndRequestPermission = async () => {
      const authStatus = await messaging().hasPermission();
      if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
        await requestUserPermission();
      }
    };

    checkAndRequestPermission();

    if (Platform.OS === 'android') {
      createNotificationChannel();
    }

    foregroundNotificationListener();

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        getToken(user);
      }
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      if (isConnected === null) {
        // กำหนดสถานะครั้งแรกโดยไม่แสดงแถบแจ้งเตือน
        setIsConnected(state.isConnected);
      } else if (state.isConnected !== isConnected) {
        // เมื่อสถานะการเชื่อมต่อเปลี่ยนไป ให้แสดงแถบแจ้งเตือน
        setIsConnected(state.isConnected);
        setShowBanner(true);
        setShouldHideBanner(false); // รีเซ็ตสถานะการซ่อนแถบ

        if (state.isConnected) {
          // ถ้าเชื่อมต่อกลับมาเป็นปกติ ให้ตั้งเวลาเพื่อซ่อนแถบหลัง 5 วินาที
          setShouldHideBanner(true);
          setTimeout(() => {
            setShowBanner(false);
          }, 4000);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeNetInfo();
    };
  }, [isConnected]);

  return (
    <View style={{ flex: 1 }}>
      {showBanner && (
        <View style={[styles.banner, isConnected ? styles.bannerOnline : styles.bannerOffline]}>
          <Text style={styles.bannerText}>
            {isConnected ? 'Connected to the Internet' : 'No Internet Connection'}
          </Text>
        </View>
      )}
      <Providers />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOffline: {
    backgroundColor: 'red',
  },
  bannerOnline: {
    backgroundColor: 'green',
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
