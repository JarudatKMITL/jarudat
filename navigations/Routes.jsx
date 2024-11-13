import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './AuthProvider.android';
import { ThemeProvider } from '../components/ThemeContext';
import AuthStack from './AuthStack.android';
import AppStack from './AppStack';
import PendingApprovalScreen from '../screen/PendingApprovalScreen'; // สร้างหน้าสำหรับรอการอนุมัติ
import { UserProvider } from '../api/UserContext';
import { LanguageProvider } from '../components/LanguageContext';

const Routes = () => {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [isApproved, setIsApproved] = useState(null); // สถานะการอนุมัติของผู้ใช้

  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (user) {
      // ดึงข้อมูลสถานะการอนุมัติของผู้ใช้จาก Firestore
      const userDoc = await firestore().collection('users').doc(user.email).get();
      if (userDoc.exists) {
        const { role_status } = userDoc.data();
        setIsApproved(role_status === 'approved');
      } else {
        setIsApproved(false); // กรณีไม่มีข้อมูลผู้ใช้
      }
    } else {
      setIsApproved(null); // รีเซ็ตสถานะเมื่อไม่มีผู้ใช้ล็อกอิน
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <NavigationContainer>
            {user ? (
              isApproved ? (
                <AppStack />
              ) : (
                <PendingApprovalScreen /> // แสดงหน้ารอการอนุมัติถ้ายังไม่ได้รับอนุมัติ
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
