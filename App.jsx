import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import Providers from './navigations';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const App = () => {
  // ฟังก์ชันขออนุญาตแจ้งเตือนจากผู้ใช้
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //console.log('Permission granted:', authStatus);
    }
  };

  // ฟังก์ชันดึง Token และบันทึกลง Firestore
  const getToken = async (user) => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        //console.log('FCM Token:', fcmToken);
        updateUserToken(user.email, fcmToken);
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  // ฟังก์ชันบันทึก Token ไปยัง Firestore
  const updateUserToken = async (email, token) => {
    try {
      await firestore().collection("users").doc(email).set(
        {
          fcmToken: token,
        },
        { merge: true }
      );
      //console.log("Token saved to Firestore for user:", email);
    } catch (error) {
      console.error("Error saving token to Firestore:", error);
    }
  };

  // สร้าง Notification Channel สำหรับ Android
  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: '1',
        channelName: 'test',
        channelDescription: 'test',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  // ตั้งค่าเพื่อรับการแจ้งเตือนเมื่อแอปอยู่ใน foreground
  const foregroundNotificationListener = () => {
    messaging().onMessage(async (remoteMessage) => {
      //console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      PushNotification.localNotification({
        channelId: '1',
        title: remoteMessage.notification?.title || 'Notification',
        message: remoteMessage.notification?.body || 'You have a new message',
      });
    });
  };

  useEffect(() => {
    requestUserPermission();

    // สร้าง Notification Channel (Android)
    if (Platform.OS === 'android') {
      createNotificationChannel();
    }

    // Listener สำหรับ foreground notifications
    foregroundNotificationListener();

    // ตั้งค่า Background Notification Handling
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Listener ตรวจจับการเปลี่ยนแปลงสถานะการล็อกอิน
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        //console.log('User logged in:', user.email);
        getToken(user); // ดึงและบันทึก token เมื่อผู้ใช้ล็อกอินสำเร็จ
      }
    });

    return () => unsubscribeAuth(); // ยกเลิก listener เมื่อ component ถูก unmount
  }, []);

  return <Providers />;
};

export default App;
