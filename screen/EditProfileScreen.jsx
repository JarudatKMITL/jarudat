import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, Modal, Pressable, TouchableOpacity, Switch, StatusBar, ScrollView, Button, RefreshControl, TextInput,ActivityIndicator } from 'react-native';
import { Avatar, Title, Caption, Text, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly
import { AuthContext } from "../navigations/AuthProvider";




const EditProfileScreen = ({navigation}) => {
    const { theme } = useTheme(); // Accessing the theme and toggle function
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(user.photoURL);
    const [selectedImage, setSelectedImage] = useState(null); // เก็บภาพที่เลือกไว้ก่อนที่จะยืนยัน
    const [displayName, setDisplayName] = useState(user.displayName || 'New User'); // ชื่อเริ่มต้น

    // สถานะสำหรับข้อมูลเพิ่มเติม
    const [email, setEmail] = useState(user.email || null);
    const [phone, setPhone] = useState(null);
    const [company, setCompany] = useState(null);
    const [department, setDepartment] = useState(null);
    const [description, setDescription] = useState(null);
    const [loading, setLoading] = useState(false); // สถานะการบันทึก

    const fetchUserProfile = async () => {
        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);
            const doc = await userDocRef.get();
            if (doc.exists) {
                const userData = doc.data();
                setProfileImage(userData.profileImage || null);
                setDisplayName(userData.name || user.displayName );
                setEmail(userData.email || null);
                setPhone(userData.phone || null);
                setCompany(userData.company || null);
                setDepartment(userData.department || null);
                setDescription(userData.description || null);
            }
        } catch (error) {
            console.log('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile(); // ดึงข้อมูลเมื่อ component ถูกโหลดครั้งแรก
    }, [user]);

    // ฟังก์ชันสำหรับเลือกจากแกลเลอรี่พร้อมครอปรูป
    const selectImageFromLibrary = () => {
        ImagePicker.openPicker({
            cropping: true,
            width: 300,
            height: 300,
        })
        .then(image => {
            setSelectedImage(image.path); // แสดงรูปที่เลือกทันที
            setProfileImage(image.path); // อัปเดตรูปโปรไฟล์ใน UI ทันที
            setModalVisible(false); // ปิด Modal
        })
        .catch(error => console.log('Error picking image: ', error));
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
            setSelectedImage(image.path); // แสดงรูปที่ถ่ายทันที
            setProfileImage(image.path); // อัปเดตรูปโปรไฟล์ใน UI ทันที
            setModalVisible(false); // ปิด Modal
        })
        .catch(error => console.log('Error capturing image: ', error));
    };

    // ฟังก์ชันบันทึกข้อมูลไปยัง Firebase เมื่อกดปุ่มบันทึก
    const [errorFields, setErrorFields] = useState({
        displayName: false,
        phone: false,
        company: false,
        department: false,
        description: false,
    }); // จัดเก็บสถานะของฟิลด์ที่มีข้อผิดพลาด

    const handleSaveProfile = async () => {
        // ตรวจสอบว่าช่องไหนว่าง
        const errors = {
            displayName: !displayName.trim(),
            phone: !phone,
            company: !company,
            department: !department,
            description: !description,
        };

        setErrorFields(errors);

        // ถ้ามีข้อผิดพลาดในฟิลด์ใดฟิลด์หนึ่งจะไม่ดำเนินการต่อ
        if (Object.values(errors).some(error => error)) {
            Alert.alert('Please fill out all required fields');
            return;
        }

        setLoading(true); // แสดงการหมุนเมื่อเริ่มบันทึก
        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.uid);

            // อัปเดตข้อมูลผู้ใช้ไปยัง Firestore
            await userDocRef.update({
                name: displayName,
                phone: phone,
                company: company,
                department: department,
                description: description,
                profileImage: selectedImage || profileImage // อัพเดทรูปภาพถ้ามีการเลือกใหม่
            });

            // ถ้ามีการเลือกรูปภาพใหม่ก็อัปเดต Firebase Authentication
            if (selectedImage) {
                await user.updateProfile({
                    photoURL: selectedImage,
                });
                setProfileImage(selectedImage); // อัปเดต UI ด้วยรูปใหม่
            }

            navigation.navigate('Profile1');

        } catch (error) {
            console.log('Error updating profile:', error);
            Alert.alert('Failed to update profile. Try again later.');
        } finally {
            setLoading(false); // ปิดการแสดงหมุนเมื่อบันทึกเสร็จ
        }
    };
    // ฟังก์ชันลบรูปภาพโปรไฟล์ทั้งใน UI และ Firebase
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

            setProfileImage(null); // ลบภาพจาก UI
            setSelectedImage(null); // ลบภาพที่เลือกจาก state
            Alert.alert('Profile image removed successfully!');
            setModalVisible(false); // ปิด Modal
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
            ],
            { cancelable: false }
        );
    };

    return (
        <ScrollView
            classname='flex-1 p-0 mb-20'
            style={{ backgroundColor: theme.backgroundColor }}
        >

            <View className='my-8'>
                <View className='flex items-center'>
                    <View className="relative">
                        <Avatar.Image
                            source={{
                                uri: profileImage ? profileImage : 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59'
                            }}
                            size={150}
                        />
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            className="absolute bottom-0 right-0 bg-black p-1 rounded-full" style={{ backgroundColor: theme.backgroundColor }}>
                            <Icon1 name="camera-outline" size={40} color={theme.iconProfile} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='mx-7 mt-10' >
                    <Text className='text-lg font-Medium mb-3' style={{ color: theme.textColor }}>Full Name</Text>
                    <View
                        className='flex-row justify-between  h-16 items-center mb-1 rounded-lg'
                        style={{ 
                            backgroundColor: theme.accentColor ,
                            borderColor: errorFields.displayName ? 'red' : theme.accentColor, // ขอบเป็นสีแดงถ้าฟิลด์ว่าง
                            borderWidth: 1
                        }}>
                        <View className='ml-7 flex-row'>
                            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                        </View>
                        <TextInput
                            style={{ color: theme.textColor }}
                            className='font-Medium text-xl mr-5'
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder={displayName}
                            placeholderTextColor={theme.textColor}
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <View className='mx-7 mt-5' >
                    <Text className='text-lg font-Medium mb-3' style={{ color: theme.textColor }}>Nick Name</Text>
                    <View
                        className='flex-row justify-between  h-16 items-center mb-1 rounded-lg'
                        style={{ 
                            backgroundColor: theme.accentColor ,
                            borderColor: errorFields.description ? 'red' : theme.accentColor, // ขอบเป็นสีแดงถ้าฟิลด์ว่าง
                            borderWidth: 1
                        }}>
                        <View className='ml-7 flex-row'>
                            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                        </View>
                        <TextInput
                            style={{ color: theme.textColor }}
                            className='font-Medium text-xl mr-5 items-center mt-1'
                            value={description}
                            onChangeText={setDescription}
                            placeholder={description ? description : 'Nick Name  '}
                            placeholderTextColor={'#AEB5BB'}
                            keyboardType="email-address"
                        />
                    </View>
                </View>
                <View className='mx-7 mt-5' >
                    <Text className='text-lg font-Medium mb-3' style={{ color: theme.textColor }}>Email</Text>
                    <View
                        className='flex-row justify-between  h-16 items-center mb-1 rounded-lg'
                        style={{ backgroundColor: theme.accentColor   }}>
                        <View className='ml-7 flex-row'>
                            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                        </View>
                        <TextInput
                            style={{ color: theme.textColor }}
                            className='font-Medium text-xl mr-5 items-center mt-1'
                            value={email}
                            onChangeText={setEmail}
                            placeholder={email}
                            placeholderTextColor={'#AEB5BB'}
                            keyboardType="email-address"
                            editable={false}
                        />
                    </View>
                </View>
                <View className='mx-7 mt-5' >
                    <Text className='text-lg font-Medium mb-3' style={{ color: theme.textColor }}>Phone</Text>
                    <View
                        className='flex-row justify-between  h-16 items-center mb-1 rounded-lg'
                        style={{ 
                            backgroundColor: theme.accentColor ,
                            borderColor: errorFields.phone ? 'red' : theme.accentColor, // ขอบเป็นสีแดงถ้าฟิลด์ว่าง
                            borderWidth: 1
                        }}>
                        <View className='ml-7 flex-row'>
                            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                        </View>
                        <TextInput
                            style={{ color: theme.textColor }}
                            className='font-Medium text-xl mr-5 items-center mt-1'
                            value={phone}
                            onChangeText={setPhone}
                            placeholder={phone ? phone : 'Phone  '}
                            placeholderTextColor={'#AEB5BB'}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
                <View className='mx-7 mt-5' >
                    <Text className='text-lg font-Medium mb-3' style={{ color: theme.textColor }}>Company</Text>
                    <View
                        className='flex-row justify-between  h-16 items-center mb-1 rounded-lg'
                        style={{ 
                            backgroundColor: theme.accentColor ,
                            borderColor: errorFields.company ? 'red' : theme.accentColor, // ขอบเป็นสีแดงถ้าฟิลด์ว่าง
                            borderWidth: 1
                        }}>
                        <View className='ml-7 flex-row'>
                            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                        </View>
                        <TextInput
                            style={{ color: theme.textColor }}
                            className='font-Medium text-xl mr-5 items-center mt-1'
                            value={company}
                            onChangeText={setCompany}
                            placeholder={company ? company : ' Your company    '}
                            placeholderTextColor={'#AEB5BB'}
                        />
                    </View>
                </View>

                <View className='mx-7 mt-5' >
                    <Text className='text-lg font-Medium mb-3' style={{ color: theme.textColor }}>Department</Text>
                    <View
                        className='flex-row justify-between  h-16 items-center mb-1 rounded-lg'
                        style={{ 
                            backgroundColor: theme.accentColor ,
                            borderColor: errorFields.department ? 'red' : theme.accentColor, // ขอบเป็นสีแดงถ้าฟิลด์ว่าง
                            borderWidth: 1
                        }}>
                        <View className='ml-7 flex-row'>
                            <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                        </View>
                        <TextInput
                            style={{ color: theme.textColor }}
                            className='font-Medium text-xl mr-5 items-center mt-1'
                            value={department}
                            onChangeText={setDepartment}
                            placeholder={department ? department : ' Your Department    '}
                            placeholderTextColor={'#AEB5BB'}
                        />
                    </View>
                </View>


                <View className='flex  items-center justify-center mt-4 mb-4' >
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#4CAF50', // สีเขียวสด
                            borderRadius: 50, // ปัดมุมให้โค้งมน
                            paddingVertical: 15,
                            paddingHorizontal: 30,
                            marginTop: 20,
                            shadowColor: '#000', // เพิ่มเงา
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 5, // เงาสำหรับ Android
                        }}
                        onPress={handleSaveProfile}
                        disabled={loading} // ปิดปุ่มเมื่อบันทึกอย
                    >

                        
                        <Text className='text-xl font-Bold'>Submit</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Loading Indicator */}
            {loading && (
                <View style={{
                    position: 'absolute', // ตำแหน่งกลางจอ
                    top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)' // สีพื้นหลังโปร่งแสง
                }}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            )}

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
    )
}

export default EditProfileScreen;