import { StatusBar, Button, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Animated, Modal } from 'react-native';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UserContext } from '../api/UserContext';
import { useTheme } from '../components/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NotificationContext } from '../api/NotificationContext';
import { PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import { LanguageContext } from '../components/LanguageContext';
import { useTranslation } from 'react-i18next';


const AdminTicketScreen = ({ navigation, }) => {

  const { profileImage, displayName, employeeID } = useContext(UserContext);
  const { theme, colorScheme } = useTheme();
  const { t } = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]); // เริ่มต้นด้วยอาร์เรย์ว่าง

  const { notifications = [], newNotificationCount = 0, resetNotificationCount, clearAllNotifications } = useContext(NotificationContext);

  const notifyUser = () => {
    // ตรวจสอบว่ามีการแจ้งเตือนเข้ามาหรือไม่
    Vibration.vibrate(500);
  };
  useEffect(() => {
    // สมมติว่ามี state ที่ใช้ในการเก็บการแจ้งเตือน
    if (notifications.length > 0) {
      notifyUser(); // เรียกใช้ฟังก์ชันสั่นเมื่อมีการแจ้งเตือนใหม่
    }
  }, [notifications]); // ตรวจสอบการเปลี่ยนแปลงของ notifications

  /// โหลดการแจ้งเตือนจาก AsyncStorage เมื่อเริ่มต้น
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem('@notifications');
        const parsedNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];
        setLocalNotifications(parsedNotifications);
      } catch (e) {
        console.error("Failed to load notifications from AsyncStorage:", e);
      }
    };
    loadNotifications();
  }, []);

  // อัปเดต localNotifications เมื่อ notifications จาก Context เปลี่ยนแปลง
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // บันทึกการแจ้งเตือนลงใน AsyncStorage
  useEffect(() => {
    const saveNotifications = async () => {
      try {
        const jsonValue = JSON.stringify(localNotifications);
        await AsyncStorage.setItem('@notifications', jsonValue);
      } catch (e) {
        console.error("Failed to save notifications to AsyncStorage:", e);
      }
    };
    saveNotifications();
  }, [localNotifications]);
  // ฟังก์ชันเปิด/ปิด Modal
  const openNotificationModal = () => {
    setModalVisible(true);
    resetNotificationCount(); // รีเซ็ตจำนวนการแจ้งเตือนใหม่เมื่อเปิด Modal
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  // ฟังก์ชันเคลียร์การแจ้งเตือนทั้งหมด
  const handleClearAll = () => {
    clearAllNotifications();
    setLocalNotifications([]);
    setModalVisible(false);
  };












  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp('5%'),
      backgroundColor: '#F5F5F5',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: wp('5%'),
      padding: wp('4%'),
      paddingVertical: hp('2%'),
      marginBottom: hp('3%'),
      marginTop: hp('5%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    userInfo: {
      flex: 1,
      paddingLeft: wp('2%'),
    },
    greeting: {
      color: '#fff',
      fontSize: wp('5%'),
      fontFamily: 'Poppins-Bold',
    },
    userName: {
      color: '#fff',
      fontSize: wp('4%'),
      marginTop: hp('0.5%'),
      fontFamily: 'Poppins-SemiBold',
    },
    notificationIconContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    notificationBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    profileIcon: {
      width: wp('15%'),
      height: wp('15%'),
      borderRadius: wp('7.5%'),
      marginRight: wp('4%'),
    },
    sectionTitle: {
      fontSize: wp('5%'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: hp('2%'),
      color: theme.textColor,
      fontFamily: 'Poppins-Bold',
    },
    services: {
      paddingHorizontal: wp('2%'),
    },
    serviceGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp('2%'),
    },
    serviceItem: {
      alignItems: 'center',
      width: wp('42%'),
      height: wp('42%'),
      backgroundColor: theme.serviceT,
      paddingVertical: hp('2%'),
      borderRadius: wp('4%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      transform: [{ scale: scaleValue }],
    },
    serviceIcon: {
      width: wp('20%'),
      height: wp('20%'),
      marginBottom: hp('2.3%'),
    },
    serviceLabel: {
      fontSize: wp('4%'),
      textAlign: 'center',
      fontWeight: '600',
      color: theme.textColor,
      fontFamily: 'Poppins-Medium',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      height: '50%',
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    notificationItem: {
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    notificationBody: {
      fontSize: 14,
      color: '#333',
    },
    clearButton: {
      backgroundColor: '#FF6347', // สีสำหรับปุ่มเคลียร์
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 10,
      flex: 1,
    },
    closeButton: {
      backgroundColor: '#007BFF', // สีสำหรับปุ่มปิด
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 10,
      flex: 1,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },

  });

  const NotificationItem = ({ item, index, onRemove }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -150) { // ตรวจสอบว่าปัดซ้ายมากกว่า 150 พิกเซล
          Animated.timing(pan, {
            toValue: { x: -500, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => onRemove(index)); // ลบการแจ้งเตือนเมื่อปัดซ้ายสำเร็จ
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    });

    return (
      <Animated.View
        style={[styles.notificationItem, { transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => alert('Notification pressed')}>
          <Text style={styles.notificationTitle}>{item.title || "Notification"}</Text>
          <Text style={styles.notificationBody}>{item.body || "No details"}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const removeNotification = (index) => {
    setLocalNotifications((prev) => {
      const updatedNotifications = prev.filter((_, i) => i !== index);
      AsyncStorage.setItem('@notifications', JSON.stringify(updatedNotifications)); // อัปเดต AsyncStorage
      return updatedNotifications;
    });
  };


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.backgroundColor}
      />

      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userName}>{t('employee_id')} : {employeeID}</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationIconContainer}
          onPress={openNotificationModal}
        >
          <Ionicons name="notifications-outline" size={28} color="white" />
          {localNotifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{localNotifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => navigation.navigate('Profile', { screen: 'Profile1' })}

        >
          <Image source={{ uri: profileImage }} style={styles.profileIcon} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Services Section */}
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.services}>
        <View style={styles.serviceGrid}>
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('CreateTicket1')}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Image source={require('../assets/images/create.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Create new ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('TakeOwnership')}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Image source={require('../assets/images/ticketOpen.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Take Ownership</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceGrid}>
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('InProgress')}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Image source={require('../assets/images/inProgress.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('Resolved')}
            onPressIn={onPressIn}
            onPressOut={onPressOut}>
            <Image source={require('../assets/images/ticketss.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket Resolved</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.serviceGrid}>
          <TouchableOpacity 
          style={styles.serviceItem}
          onPress={() => navigation.navigate('ListTickets')} 
          onPressIn={onPressIn} 
          onPressOut={onPressOut}>
            <Image source={require('../assets/images/listTicket.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
          style={styles.serviceItem} 
          onPress={() => navigation.navigate('SummaryTickets')} 
          onPressIn={onPressIn} 
          onPressOut={onPressOut}>
            <Image source={require('../assets/images/sumTicket.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket Summary</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Notifications as Bottom Sheet */}
      {/* Modal for Notifications as Bottom Sheet */}
      {/* Modal for Notifications */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {localNotifications.length > 0 ? (
              <ScrollView>
                {localNotifications.map((item, index) => (
                  <NotificationItem
                    key={index}
                    item={item}
                    index={index}
                    onRemove={() => removeNotification(index)}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>No notifications available</Text>
            )}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearAll}
              >
                <Text style={styles.buttonText}>Clear All</Text>
              </TouchableOpacity>


            </View>
          </View>
        </View>
      </Modal>


    </ScrollView>
  );
};

export default AdminTicketScreen;
