import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './AuthProvider.android';
import { ThemeProvider } from '../components/ThemeContext';
import AuthStack from './AuthStack.android';
import AppStack from './AppStack';
import PendingApprovalScreen from '../screen/PendingApprovalScreen';
import { UserProvider } from '../api/UserContext';
import { LanguageProvider } from '../components/LanguageContext';
import CustomLoading from '../components/CustomLoading';

const Routes = () => {
  const { user, setUser } = useContext(AuthContext);
  console.log('Routes User:', user); // ตรวจสอบ User ที่ถูกส่งมาจาก Context
  const [initializing, setInitializing] = useState(true);
  const [isApproved, setIsApproved] = useState(null); // สถานะการอนุมัติของผู้ใช้

  useEffect(() => {
    let unsubscribe = null;

    const subscriber = auth().onAuthStateChanged((user) => {
      setInitializing(true); // แสดงสถานะโหลดเมื่อเริ่มต้น
      if (unsubscribe) {
        unsubscribe(); // ล้าง Subscribe เก่า
      }

      if (user) {
        const userDocRef = firestore().collection('users').doc(user.email);

        unsubscribe = userDocRef.onSnapshot(
          (doc) => {
            if (doc.exists) {
              const { role_status = 'pending' } = doc.data(); // กำหนดค่าดีฟอลต์
              setIsApproved(role_status === 'approved');
            } else {
              console.log('User document does not exist.');
              setIsApproved(false);
            }

          },
          (error) => {
            console.error('Firestore snapshot error:', error);
            setIsApproved(false);
          }
        );
      } else {
        setIsApproved(null);
      }

      setUser(user);
      if (initializing)
        setInitializing(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      subscriber();
    };
  }, []);

  if (initializing) {
    return (
      <CustomLoading />
    );
  }
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <NavigationContainer>
            {user ? (
              isApproved ? (
                <AppStack />
              ) : (
                <PendingApprovalScreen />
              )
            ) : (
              <AuthStack />
            )}
          </NavigationContainer>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Routes;
