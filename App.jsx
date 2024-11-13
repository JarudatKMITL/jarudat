// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Providers from './navigations';
import NetInfo from '@react-native-community/netinfo';
import { NotificationProvider } from './api/NotificationContext';
import firestore from '@react-native-firebase/firestore';


const App = () => {
  const [isConnected, setIsConnected] = useState(null); // null เพื่อระบุสถานะเริ่มต้น
  const [showBanner, setShowBanner] = useState(false);
  const [shouldHideBanner, setShouldHideBanner] = useState(false); // ตัวแปรควบคุมการซ่อนแถบ
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
      unsubscribeNetInfo();
    };
  }, [isConnected]);

  return (
    <NotificationProvider>
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
    </NotificationProvider>
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
