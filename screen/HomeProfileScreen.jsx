import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, Modal, Pressable, TouchableOpacity, Switch, StatusBar, ScrollView, Button, RefreshControl } from 'react-native';
import { Avatar, Title, Caption, Text, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly
import { AuthContext } from "../navigations/AuthProvider";
import { useFocusEffect } from '@react-navigation/native';

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

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...');
      const userDocRef = firebase.firestore().collection('users').doc(user.uid);
      const doc = await userDocRef.get();
      if (doc.exists) {
        const userData = doc.data();
        // ตั้งค่าข้อมูลที่ดึงมาจาก Firestore
        setProfileImage(userData.profileImage || 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59');
        setDisplayName(userData.name || 'New User');
        setEmail(userData.email || null);
        setPhone(userData.phone || null);
        setCompany(userData.company || null);
        setDepartment(userData.department || null);
        setDescription(userData.description || null);
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
      const userDocRef = firebase.firestore().collection('users').doc(user.uid);

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

  return (
    <ScrollView
      classname='flex-1 p-0 mb-20'
      style={{ backgroundColor: theme.backgroundColor }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} // or "dark-content"
        backgroundColor={theme.backgroundColor} // Set this to match your header
      />
      <View className='my-5'>
        <View className='flex items-center'>
          <View className="relative">
            <Avatar.Image
              source={{
                uri: profileImage ? profileImage : 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59'
              }}
              size={120}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="absolute bottom-1 right-1 bg-black p-1 rounded-full" style={{ backgroundColor: theme.backgroundColor }}>
              <Icon1 name="camera-outline" size={24} color={theme.iconProfile} />
            </TouchableOpacity>
          </View>
          <View className='mt-3 items-center'>
            <Title
              className='mt-4 text-[25px] font-Bold  '
              style={{ color: theme.textColor }}>
              {displayName ? displayName : 'New User'}
            </Title>
            <Caption className='text-lg'
              style={{ color: theme.textColor }} >
              {description ? description : 'Null'}
            </Caption>
          </View>
        </View>
      </View>

      <View className='ml-5 mr-5 '>
        <View className='mb-5'>
          <Text
            className='text-xl font-SemiBold'
            style={{ color: theme.textColor }}>
            Personal Info
          </Text>
        </View>

        <View
          className='flex-row justify-between  rounded-t-lg h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row '>
            <Icon name="email-outline" color={theme.iconProfile} size={25} />
            <Text className='ml-3 text-lg font-Medium' style={{ color: theme.textColor }}>Email : </Text>
          </View>
          <View>
            <Text
              className='text-lg font-Medium mr-7'
              style={{ color: theme.textColor }}>
              {email ? email : 'Null'}
            </Text>
          </View>
        </View>

        <View
          className='flex-row justify-between  h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row'>
            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
            <Text className='ml-3 text-lg font-Medium' style={{ color: theme.textColor }}>Phone : </Text>
          </View>
          <View>
            <Text
              className='text-lg font-Medium mr-7'
              style={{ color: theme.textColor }}>
              {phone ? phone : 'Null'}
            </Text>
          </View>
        </View>

        <View
          className='flex-row justify-between  h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row'>
            <Icon name="city-variant-outline" color={theme.iconProfile} size={25} />
            <Text className='ml-3 text-lg font-Medium' style={{ color: theme.textColor }}>Company : </Text>
          </View>
          <View>
            <Text
              className='text-lg font-Medium mr-7'
              style={{ color: theme.textColor }}>
              {company ? company : 'Null'}
            </Text>
          </View>
        </View>

        <View
          className='flex-row justify-between  rounded-b-xl  h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row'>
            <Icon name="heart-circle-outline" color={theme.iconProfile} size={25} />
            <Text className='ml-3 text-lg font-Medium' style={{ color: theme.textColor }}>Department : </Text>
          </View>
          <View>
            <Text
              className='text-lg font-Medium mr-7'
              style={{ color: theme.textColor }}>
              {department ? department : 'Null'}
            </Text>
          </View>
        </View>

      </View>

      <View className='ml-5 mr-5 my-5'>
        <View className='mb-5'>
          <Text className='text-xl font-SemiBold' style={{ color: theme.textColor }}>Utilites</Text>
        </View>

        <TouchableOpacity
          className='flex-row justify-between  rounded-t-xl bg-slate-400 h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row items-center'>
            <Icon1 name="person-outline" color={theme.iconProfile} size={25} />
            <Text
              className='text-lg font-Medium ml-3'
              style={{ color: theme.textColor }}>
              Account Settings
            </Text>
          </View>
          <View >
            <TouchableOpacity className='mr-4'>
              <Icon1
                name="chevron-forward-outline"
                color={theme.iconProfile} size={30}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-row justify-between h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row items-center'>
            <Icon1 name="notifications-off-outline" color={theme.iconProfile} size={25} />
            <Text
              className='text-lg font-Medium ml-3'
              style={{ color: theme.textColor }}>
              Notification
            </Text>
          </View>
          <View >
            <TouchableOpacity className='mr-4'>
              <Icon1
                name="chevron-forward-outline"
                color={theme.iconProfile} size={30}

              />

            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-row justify-between h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}
          onPress={toggleColorScheme}
        >
          <View className='ml-7 flex-row items-center'>
            <Icon1 name="moon-outline" color={theme.iconProfile} size={25} />
            <Text
              className='text-lg font-Medium ml-3'
              style={{ color: theme.textColor }}>
              Dark Mode
            </Text>
          </View>
          <View className='mr-3'>
            <Switch
              className='ml-5'
              value={colorScheme === 'dark'} // แสดงสถานะตามธีมปัจจุบัน
              onValueChange={toggleColorScheme} // เมื่อกดจะสลับธีม
              trackColor={{ false: '#767577', true: '#FAFAFA' }} // เปลี่ยนสีของ track
              thumbColor={colorScheme === 'dark' ? '#00C853' : '#f4f3f4'} // เปลี่ยนสีของ thumb
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // เพิ่มขนาดปุ่ม
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-row justify-between h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}>
          <View className='ml-7 flex-row items-center'>
            <Icon1 name="help-circle-outline" color={theme.iconProfile} size={25} />
            <Text
              className='text-lg font-Medium ml-3'
              style={{ color: theme.textColor }}>
              Help
            </Text>
          </View>
          <View >
            <TouchableOpacity className='mr-4'>
              <Icon1
                name="chevron-forward-outline"
                color={theme.iconProfile} size={30}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className='flex-row justify-between  rounded-b-xl  h-16 items-center mb-1'
          style={{ backgroundColor: theme.accentColor }}
          onPress={logout}>
          <View className='ml-7 flex-row items-center'>
            <Icon1 name="exit-outline" color={theme.iconProfile} size={25} />
            <Text
              className='text-lg font-Medium ml-3'
              style={{ color: theme.textColor }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-80 bg-white rounded-lg p-5">
            <Text className="text-center text-xl font-bold mb-4">Profile Photo</Text>
            <View className="flex-row justify-around">
              {/* Camera Option */}
              <Pressable onPress={takePhotoWithCamera} className="items-center">
                <Icon1 name="camera-outline" size={40} color="#FFC107" />
                <Text className="mt-1">Camera</Text>
              </Pressable>
              {/* Gallery Option */}
              <Pressable onPress={selectImageFromLibrary} className="items-center">
                <Icon2 name="photo-library" size={40} color="#FFC107" />
                <Text className="mt-1">Gallery</Text>
              </Pressable>
              {/* Remove Option */}
              <Pressable onPress={confirmRemoveImage} className="items-center">
                <Icon name="delete" size={40} color="#FF3D00" />
                <Text className="mt-1">Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeProfileScreen;
