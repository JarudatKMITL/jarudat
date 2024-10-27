import React, { useContext, useState, useEffect } from 'react';
import {StyleSheet, Alert, View, Modal, Pressable, TouchableOpacity, Switch, StatusBar, ScrollView, Button, RefreshControl } from 'react-native';
import { Avatar, Title, Caption, Text, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly
import { AuthContext } from "../navigations/AuthProvider";
import { useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeProfileScreen = () => {
  const { theme, toggleColorScheme, colorScheme } = useTheme(); // Accessing the theme and toggle function
  const { user, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(user.photoURL);
  const [selectedImage, setSelectedImage] = useState(null); // เก็บภาพที่เลือกไว้ก่อนที่จะยืนยัน
  const [displayName, setDisplayName] = useState(user.displayName || 'New User'); // ชื่อเริ่มต้น
  const [refreshing, setRefreshing] = useState(false); // สถานะการรีเฟรช

  // สถานะสำหรับข้อมูลเพิ่มเติม
  const [email, setEmail] = useState(user.email || null);
  const [phone, setPhone] = useState(null);
  const [company, setCompany] = useState(null);
  const [department, setDepartment] = useState(null);
  const [description, setDescription] = useState(null);
  const [role, setRole] = useState('user'); // เพิ่ม state สำหรับ role

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const userDocRef = firebase.firestore().collection('users').doc(user.email);
      const doc = await userDocRef.get();
      if (doc.exists) {
        const userData = doc.data();
        // ตั้งค่าข้อมูลที่ดึงมาจาก Firestore
        setProfileImage(userData.profileImage || 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59');
        setDisplayName(userData.name || user.displayName);
        setEmail(userData.email || null);
        setPhone(userData.phone || null);
        setCompany(userData.company || null);
        setDepartment(userData.department || null);
        setDescription(userData.description || 'Nick Name');
        setRole(userData.role || 'user'); // ดึง role มาจาก Firestore
        console.log('User profile fetched successfully:', userData);
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // เรียกใช้เมื่อ component ถูกโหลดครั้งแรก
  }, [user]);

  // ฟังก์ชันรีเฟรชเมื่อเลื่อนลง
  const onRefresh = async () => {
    console.log('Refreshing profile...');
    setRefreshing(true); // เริ่มการรีเฟรช
    try {
      await fetchUserProfile(); // เรียกฟังก์ชันดึงข้อมูลโปรไฟล์
    } catch (error) {
      console.log('Error during refresh:', error);
    } finally {
      setRefreshing(false); // ปิดการรีเฟรช
      console.log('Refresh completed');
    }
  };

  // ฟังก์ชันสำหรับอัปเดตเฉพาะรูปโปรไฟล์
  const handleUpdateProfileImage = async (imagePath) => {
    try {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);

      // ตรวจสอบว่ามีเอกสารของผู้ใช้อยู่หรือไม่
      const doc = await userDocRef.get();
      if (!doc.exists) {
        // ถ้าไม่มีเอกสาร สร้างเอกสารใหม่ใน Firestore
        await userDocRef.set({
          profileImage: imagePath,
          name: user.displayName,
          email: user.email,
        });
      } else {
        // ถ้ามีเอกสารอยู่แล้ว ทำการอัปเดตเฉพาะรูปโปรไฟล์
        await userDocRef.update({
          profileImage: imagePath,
        });
      }

      // อัปเดตรูปภาพใน Firebase Authentication
      await user.updateProfile({
        photoURL: imagePath,
      });

      setProfileImage(imagePath); // อัปเดตสถานะรูปโปรไฟล์ใน UI
      Alert.alert('Profile image updated successfully!');
    } catch (error) {
      console.log('Error updating profile image: ', error);
      Alert.alert('Failed to update profile image. Try again later.');
    }
  };

  // ฟังก์ชันสำหรับการยืนยันเปลี่ยนรูปภาพ
  const confirmImageUpdate = () => {
    Alert.alert(
      'Confirm Image Change',
      'Do you want to update your profile picture?',
      [
        {
          text: 'Cancel',
          onPress: () => setSelectedImage(null), // ถ้ายกเลิกจะไม่อัปเดต
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            handleUpdateProfileImage(selectedImage); // ถ้ายืนยันจะอัปเดตภาพ
            setModalVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // ฟังก์ชันสำหรับเลือกจากแกลเลอรี่พร้อมครอปรูป
  const selectImageFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
    })
      .then(image => {
        setSelectedImage(image.path); // เก็บรูปที่เลือกไว้ใน state
        confirmImageUpdate(); // เรียกฟังก์ชันยืนยัน
      })
      .catch((error) => {
        console.log("Error picking image: ", error);
      })
      .finally(() => {
        // ปิด Modal ไม่ว่าจะเกิดอะไรขึ้น
        setModalVisible(false);
      });
  };

  // ฟังก์ชันสำหรับถ่ายรูปพร้อมครอปรูป
  const takePhotoWithCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      cropperCircleOverlay: true,
      width: 300,
      height: 300,
    })
      .then(image => {
        setSelectedImage(image.path); // เก็บรูปที่ถ่ายไว้ใน state
        confirmImageUpdate(); // เรียกฟังก์ชันยืนยัน
      })
      .catch((error) => {
        console.log("Error capturing image: ", error);
      })
      .finally(() => {
        // ปิด Modal ไม่ว่าจะเกิดอะไรขึ้น
        setModalVisible(false);
      });
  };

  // ฟังก์ชันลบรูปภาพโปรไฟล์
  const handleRemoveProfileImage = async () => {
    try {
      const userDocRef = firebase.firestore().collection('users').doc(user.uid);

      // ตั้งค่า profileImage เป็น null ใน Firestore
      await userDocRef.update({
        profileImage: null,
      });

      // อัปเดต Firebase Authentication ให้เป็น null ด้วย
      await user.updateProfile({
        photoURL: null,
      });

      setProfileImage(null); // ตั้งค่าโปรไฟล์ใน UI เป็น null
      Alert.alert('Profile image removed successfully!');
    } catch (error) {
      console.log('Error removing profile image: ', error);
      Alert.alert('Failed to remove profile image. Try again later.');
    }
  };

  // ฟังก์ชันการยืนยันการลบรูปภาพโปรไฟล์
  const confirmRemoveImage = () => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove your profile picture?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleRemoveProfileImage(), // ถ้ายืนยันจะลบรูปโปรไฟล์
        },
        setModalVisible(false),
      ],
      { cancelable: false }
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      // ฟังก์ชันที่ต้องการทำเมื่อหน้าจอถูกแสดงหรือผู้ใช้กลับมา
      fetchUserProfile(); // เรียกฟังก์ชันดึงข้อมูลโปรไฟล์ใหม่เมื่อกลับมาหน้าจอ

      return () => {
        // ทำความสะอาดถ้าจำเป็นเมื่อออกจากหน้า (ไม่จำเป็นต้องใส่ถ้าไม่มีการทำงานพิเศษ)
      };
    }, [])
  );

  
  const styles = StyleSheet.create({
    // Main containers
    scrollView: { 
      backgroundColor: theme.backgroundColor 
    },
    container: { 
      marginVertical: hp('2%'), 
      alignItems: 'center' 
    },
    avatarContainer: { 
      position: 'relative' 
    },
    profileTextContainer: { 
      marginTop: hp('2%'), 
      alignItems: 'center' 
    },
    sectionContainer: { 
      marginHorizontal: wp('5%'), 
      marginBottom: hp('2%') 
    },
  
    // Text styles
    titleText: { 
      fontSize: wp('5.5%'), 
      fontFamily: 'Poppins-Bold', 
    },
    captionText: { 
      fontSize: wp('4%'), 
      fontFamily: 'Poppins-Medium', 
    },
    sectionHeaderText: { 
      fontSize: wp('5%'), 
      fontWeight: '600' ,
      fontFamily: 'Poppins-SemiBold', 
      marginBottom: 10,
    },
    itemText: { 
      fontSize: wp('4%'), 
      marginLeft: wp('3%'), 
      marginRight:16,
      fontFamily: 'Poppins-Light', 
      
    },
    modalTitle: { 
      textAlign: 'center', 
      fontSize: wp('5%'), 
      fontWeight: 'bold', 
      marginBottom: hp('2%') 
    },
    iconText: { 
      marginTop: hp('1%'), 
      fontSize: wp('3.5%') 
    },
  
    // Item containers
    itemContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: theme.accentColor, 
      height: hp('8%'), 
      marginBottom: hp('0.5%') 
    },
    itemTopRounded: { 
      borderTopLeftRadius: wp('2%'), 
      borderTopRightRadius: wp('2%') 
    },
    itemBottomRounded: { 
      borderBottomLeftRadius: wp('2%'), 
      borderBottomRightRadius: wp('2%') 
    },
    itemLeft: { 
      flexDirection: 'row', 
      marginLeft: wp('5%'), 
      alignItems: 'center' 
    },
  
    // Button and Icon styles
    cameraButton: { 
      position: 'absolute', 
      bottom: wp('0%'), 
      right: wp('0%'), 
      padding: wp('2%'), 
      borderRadius: wp('50%') 
    },
    iconRight: { 
      marginRight: wp('5%') 
    },
    iconButton: { 
      alignItems: 'center' 
    },
    switch: { 
      transform: [{ scaleX: wp('0.4') }, { scaleY: wp('0.4') }], 
      marginRight: wp('5%') 
    },
  
    // Modal styles
    modalBackground: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)' 
    },
    modalContainer: { 
      width: wp('80%'), 
      backgroundColor: 'white', 
      borderRadius: wp('4%'), 
      padding: hp('2%') 
    }
  });
  
  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: theme.backgroundColor }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {onRefresh}} />}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundColor} />
      
      {/* Profile Header */}
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image source={{
                uri: profileImage ? profileImage : 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59'
              }} size={wp('30%')} />
          
        </View>
        <View style={styles.profileTextContainer}>
          <Title style={[styles.titleText, { color: theme.textColor }]}>{displayName ? displayName : 'Please enter your name.'}</Title>
          <Caption style={[styles.captionText, { color: theme.textColor }]}>{role} : {description ?description:'nickname'}</Caption>
        </View>
      </View>
      
      {/* Personal Info */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeaderText, { color: theme.textColor }]}>Personal Info</Text>
        <View style={[styles.itemContainer, styles.itemTopRounded]}>
          <View style={styles.itemLeft}>
            <Icon name="email-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Email : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{email ? email : 'Null'}</Text>
        </View>

        {/* Additional Info Items */}
        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Icon name="phone-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Phone : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{phone ? phone : 'Null'}</Text>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Icon name="city-variant-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Company : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{company ? company : 'Null'}</Text>
        </View>

        <View style={[styles.itemContainer, styles.itemBottomRounded]}>
          <View style={styles.itemLeft}>
            <Icon name="heart-circle-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Department : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{department ? department : 'Null'}</Text>
        </View>
      </View>

      {/* Utilities */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeaderText, { color: theme.textColor }]}>Utilities</Text>
        
        {/* Utility Items */}
        <TouchableOpacity style={[styles.itemContainer, styles.itemTopRounded]}>
          <View style={styles.itemLeft}>
            <Icon1 name="person-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Account Settings</Text>
          </View>
          <Icon1 name="chevron-forward-outline" color={theme.iconProfile} size={wp('7%')} style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Icon1 name="notifications-off-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Notification</Text>
          </View>
          <Icon1 name="chevron-forward-outline" color={theme.iconProfile} size={wp('7%')} style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={toggleColorScheme}>
          <View style={styles.itemLeft}>
            <Icon1 name="moon-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Dark Mode</Text>
          </View>
          <Switch value={colorScheme === 'dark'} onValueChange={toggleColorScheme}
                  trackColor={{ false: '#767577', true: '#FAFAFA' }} thumbColor={colorScheme === 'dark' ? '#00C853' : '#f4f3f4'}
                  style={styles.switch} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.itemContainer, styles.itemBottomRounded]} onPress={logout}>
          <View style={styles.itemLeft}>
            <Icon1 name="exit-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Modal for Profile Picture */}
      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Profile Photo</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Pressable onPress={takePhotoWithCamera} style={styles.iconButton}>
                <Icon1 name="camera-outline" size={wp('10%')} color="#FFC107" />
                <Text style={styles.iconText}>Camera</Text>
              </Pressable>
              <Pressable onPress={selectImageFromLibrary} style={styles.iconButton}>
                <Icon2 name="photo-library" size={wp('10%')} color="#FFC107" />
                <Text style={styles.iconText}>Gallery</Text>
              </Pressable>
              <Pressable onPress={confirmRemoveImage} style={styles.iconButton}>
                <Icon name="delete" size={wp('10%')} color="#FF3D00" />
                <Text style={styles.iconText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeProfileScreen;
