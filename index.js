import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// ตั้งค่า background message handler ที่นี่
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    // คุณสามารถเพิ่มการแจ้งเตือนที่นี่ หรือจัดการข้อความตามต้องการ
  });
AppRegistry.registerComponent(appName, () => App);
