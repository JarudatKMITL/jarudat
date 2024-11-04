// NotificationContext.js
import React, { createContext, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
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

  const foregroundNotificationListener = () => {
    messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification || {};
      const channelId = remoteMessage.data?.channelId || 'general_notifications';

      console.log("Foreground message received:", remoteMessage);

      PushNotification.localNotification({
        channelId, // ใช้ channelId ที่ส่งมาหรือใช้ default
        title: title || 'Notification',
        message: body || 'You have a new message',
        playSound: true,
        soundName: 'default',
        vibrate: true,
        priority: 'high',
        importance: 'high',
        allowWhileIdle: true,
      });
    });
  };

  useEffect(() => {
    requestUserPermission();

    if (Platform.OS === 'android') {
      createNotificationChannels();
    }

    foregroundNotificationListener();

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification || {};
      const channelId = remoteMessage.data?.channelId || 'general_notifications';

      console.log("Background message received:", remoteMessage);

      PushNotification.localNotification({
        channelId, // ใช้ channelId ที่ส่งมาหรือใช้ default
        title: title || 'Notification',
        message: body || 'You have a new message',
        playSound: true,
        soundName: 'default',
        vibrate: true,
        priority: 'high',
        importance: 'high',
        allowWhileIdle: true,
      });
    });

    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        getToken(user);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};
