// NotificationContext.js
import React, { createContext, useEffect, useState } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children , navigate , navigation }) => {
  

  const [notifications, setNotifications] = useState([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0); // เพิ่ม state สำหรับจำนวนการแจ้งเตือนใหม่


  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission(); // ขออนุญาตใหม่ทุกครั้งที่แอปเริ่มทำงาน
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert(
        "Enable Notifications",
        "To stay updated with alerts, please enable notifications in Settings.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings() // เปิดการตั้งค่าแอปของอุปกรณ์
          }
        ]
      );
    } else {
      console.log("Notification permission granted.");
    }
  };

  const getToken = async (user) => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
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

  const createNotificationChannels = () => {
    // ช่องทางการแจ้งเตือนทั่วไป
    PushNotification.createChannel(
      {
        channelId: 'general_notifications',
        channelName: 'General Notifications',
        channelDescription: 'General app notifications',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    // ช่องทางการแจ้งเตือนสำหรับ Ticket
    PushNotification.createChannel(
      {
        channelId: 'ticket_notifications', // กำหนด channelId เฉพาะสำหรับระบบ Ticket
        channelName: 'Ticket Notifications',
        channelDescription: 'Notifications for Ticket updates and alerts',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Ticket channel created: '${created}'`)
    );
  };


  const handleNotification = (title, body, channelId, showPush, screen, data) => {
    // หาก showPush เป็น false ให้เพิ่มการแจ้งเตือนลงใน Context
    if (!showPush) {
      setNotifications((prev) => [...prev, { title, body, channelId, screen, }]);
      setNewNotificationCount((count) => count + 1);
    }

    // หาก showPush เป็น true ให้แสดงเป็น Push Notification โดยไม่เพิ่มลงใน Context
    if (showPush) {
      PushNotification.localNotification({
        channelId,
        title: title || 'Notification',
        message: body || 'You have a new message',
        playSound: true,
        soundName: 'default',
        vibrate: true,
        priority: 'high',
        importance: 'high',
        allowWhileIdle: true,
        userInfo: { screen, data }, // ส่งข้อมูลเพิ่มเติมที่ต้องการ
      });
    }
  };


  const foregroundNotificationListener = () => {
    messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification || {};
      const channelId = remoteMessage.data?.channelId || 'general_notifications';
      const showPush = remoteMessage.data?.showPush === 'true';

      // แปลง `screen` และ `data` กลับจาก string ที่ถูก escape ซ้ำ
      const screen = remoteMessage.data?.screen;
      const data = remoteMessage.data?.data ? JSON.parse(remoteMessage.data.data) : {};
      console.log("Foreground message received:", remoteMessage);

      // เรียกใช้ handleNotification พร้อมตัวแปร showPush
      handleNotification(title, body, channelId, showPush, screen, data);
    });
  };

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification || {};
      const channelId = remoteMessage.data?.channelId || 'general_notifications';
      const showPush = remoteMessage.data?.showPush === 'true';

      // แปลง `screen` และ `data` กลับจาก string ที่ถูก escape ซ้ำ
      const screen = remoteMessage.data?.screen;
      const data = remoteMessage.data?.data ? JSON.parse(remoteMessage.data.data) : {};
      //console.log("Background message received:", remoteMessage);

      // เรียกใช้ handleNotification พร้อมตัวแปร showPush
      handleNotification(title, body, channelId, showPush, screen, data);
    });
  }, []);



  useEffect(() => {
    requestUserPermission();

    if (Platform.OS === 'android') {
      createNotificationChannels();
    }

    foregroundNotificationListener();



    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        getToken(user);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // เพิ่ม listener เพื่อนำทางเมื่อกดแจ้งเตือน
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const screen = remoteMessage.data?.screen;
      const data = remoteMessage.data?.data ? JSON.parse(remoteMessage.data.data) : {};
      //console.log("Notification opened:", screen, data);
      //if (screen) {
        //console.log(`Navigating to ${screen} with data:`, data); // ตรวจสอบค่าก่อนนำทาง
        //navigation.navigate('AdminTicket', { param1: 'value1', param2: 'value2' });

      //}
    });

    // ตรวจสอบเมื่อเปิดแอปจากการแจ้งเตือน
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const screen = remoteMessage.data?.screen;
          const data = remoteMessage.data?.data ? JSON.parse(remoteMessage.data.data) : {};
          //console.log("Initial notification:", screen, data); // เพิ่ม log เพื่อตรวจสอบ
          //if (screen && navigate) {
            // console.log(`Navigating to ${screen} from initial notification with data:`, data); // ตรวจสอบค่าก่อนนำทาง
             //navigation.navigate('AdminTicket', { param1: 'value1', param2: 'value2' });

          //}
        }
      });

    return unsubscribe;
  }, [navigate]);




  // ใน NotificationContext.js
  const clearAllNotifications = async () => {
    try {
      setNotifications([]); // เคลียร์การแจ้งเตือนจาก Context
      await AsyncStorage.removeItem('@notifications'); // เคลียร์การแจ้งเตือนจาก AsyncStorage
      console.log("Cleared all notifications from both Context and AsyncStorage");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  const resetNotificationCount = () => {
    setNewNotificationCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, newNotificationCount, resetNotificationCount, clearAllNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
