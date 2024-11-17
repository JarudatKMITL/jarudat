import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomLoading = ({ 
    message = "กำลังโหลดข้อมูล...", 
    animationSource }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={animationSource || require('../assets/animations/loading-animation.json')} // ไฟล์ Lottie Animation
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default CustomLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c63ff',
    textAlign: 'center',
  },
});
