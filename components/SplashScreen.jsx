import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-lottie-splash-screen';

const CustomSplashScreen = () => {
    useEffect(() => {
        // ซ่อน Splash Screen หลังจากโหลดข้อมูลเสร็จ
        setTimeout(() => {
            SplashScreen.hide();
        }, 7000); // 3 วินาที (ปรับตามต้องการ)
    }, []);

    return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // สีพื้นหลังที่จะแสดงระหว่างโหลด
    },
});

export default CustomSplashScreen;
