import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// ฟังก์ชันเพื่อขอสิทธิ์จากผู้ใช้
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    console.log('Notification permission not granted');
  }
}

// รับ token ของอุปกรณ์
async function getFcmToken() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    // บันทึก fcmToken ของผู้ใช้ในฐานข้อมูล (เช่น Firestore)
  }
}

// รับข้อความแจ้งเตือนในขณะที่แอปทำงานอยู่ (Foreground)
messaging().onMessage(async remoteMessage => {
  console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

// เรียกใช้ฟังก์ชันเมื่อแอปเริ่มทำงาน
requestUserPermission();
getFcmToken();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
