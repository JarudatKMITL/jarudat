import React from 'react';
import { StyleSheet, Dimensions, SafeAreaView, StatusBar,Image, } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content" // หรือใช้ "light-content" ถ้าพื้นหลังเข้ม
      />
      <Onboarding
        onSkip={() => navigation.navigate("HomeLogin")}
        onDone={() => navigation.navigate("HomeLogin")}
        pages={[
          {
            backgroundColor: '#FFDEE9',
            image: (
              <LottieView
                source={require('../assets/animations/welcome.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            ),
            title: 'ยินดีต้อนรับ!',
            subtitle: 'เริ่มต้นการเดินทางใหม่ของคุณ ด้วยฟีเจอร์สุดพิเศษที่รอคุณอยู่.',
          },
          {
            backgroundColor: '#B5EAD7',
            image: (
              <Image
                source={require('../assets/images/inProgress.png')}
                style={styles.image}
              />
            ),
            title: 'ติดตามความก้าวหน้า',
            subtitle: 'จัดการงานและติดตามเป้าหมายของคุณได้ง่ายและรวดเร็ว.',
          },
          {
            backgroundColor: '#FFDAC1',
            image: (
              <LottieView
                source={require('../assets/animations/thank-you.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            ),
            title: 'ทำงานร่วมกัน',
            subtitle: 'สร้างและแชร์เป้าหมายของคุณกับทีมได้ง่าย ๆ.',
          },
          {
            backgroundColor: '#FF9AA2',
            image: (
              <Image
                source={require('../assets/images/inProgress.png')}
                style={styles.image}
              />
            ),
            title: 'เริ่มใช้งานเลย!',
            subtitle: 'มาร่วมสร้างความสำเร็จกับเรา.',
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: width * 0.6,
    height: height * 0.4,
  },
  image: {
    width: width * 0.6,
    height: height * 0.4,
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;
