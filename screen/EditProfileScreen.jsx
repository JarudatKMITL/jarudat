import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, Modal, Pressable, TouchableOpacity, StatusBar, ScrollView, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '../components/ThemeContext';
import { AuthContext } from "../navigations/AuthProvider";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';

const EditProfileScreen = ({ navigation }) => {
    const { theme, colorScheme } = useTheme(); // Accessing the theme and toggle function
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
            const userDocRef = firebase.firestore().collection('users').doc(user.email);
            const doc = await userDocRef.get();
            if (doc.exists) {
                const userData = doc.data();
                setProfileImage(userData.profileImage || null);
                setDisplayName(userData.name || user.displayName);
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

    // ฟังก์ชันสำหรับอัปโหลดรูปภาพไปยัง Firebase Storage
    const uploadImageToFirebase = async (localPath) => {
        const filename = `${user.email}_profile_${new Date().getTime()}.jpg`;
        const storageRef = storage().ref(`profileImages/${filename}`);
        await storageRef.putFile(localPath);
        const url = await storageRef.getDownloadURL();
        return url;
    };

    // ฟังก์ชันสำหรับเลือกจากแกลเลอรี่
    const selectImageFromLibrary = () => {
        ImagePicker.openPicker({
            cropping: true,
            width: 300,
            height: 300,
        })
            .then(image => {
                setSelectedImage(image.path); // เก็บพาธรูปในเครื่อง
                setProfileImage(image.path); // อัปเดต UI
                setModalVisible(false);
            })
            .catch(error => console.log('Error picking image: ', error));
    };

    // ฟังก์ชันสำหรับถ่ายรูป
    const takePhotoWithCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            cropperCircleOverlay: true,
            width: 300,
            height: 300,
        })
            .then(image => {
                setSelectedImage(image.path); // เก็บพาธรูปในเครื่อง
                setProfileImage(image.path); // อัปเดต UI
                setModalVisible(false);
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
        const errors = {
            displayName: !displayName.trim(),
            phone: !phone,
            company: !company,
            department: !department,
            description: !description,
        };

        setErrorFields(errors);

        if (Object.values(errors).some(error => error)) {
            Alert.alert('Please fill out all required fields');
            return;
        }

        setLoading(true);
        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.email);

            let imageUrl = profileImage;

            // ถ้ามีการเลือกรูปใหม่ จะอัปโหลดไปยัง Firebase Storage
            if (selectedImage) {
                imageUrl = await uploadImageToFirebase(selectedImage);
            }

            // อัปเดตข้อมูลไปยัง Firestore
            await userDocRef.update({
                name: displayName,
                phone: phone,
                company: company,
                department: department,
                description: description,
                profileImage: imageUrl // เก็บลิงก์ของรูปภาพที่อัปโหลด
            });

            if (selectedImage) {
                await user.updateProfile({
                    photoURL: imageUrl,
                });
                setProfileImage(imageUrl); // อัปเดต UI
            }

            navigation.navigate('Profile1');

        } catch (error) {
            console.log('Error updating profile:', error);
            Alert.alert('Failed to update profile. Try again later.');
        } finally {
            setLoading(false);
        }
    };
    // ฟังก์ชันลบรูปภาพโปรไฟล์ทั้งใน UI และ Firebase
    const handleRemoveProfileImage = async () => {
        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.email);

            await userDocRef.update({
                profileImage: null,
            });

            await user.updateProfile({
                photoURL: null,
            });

            setProfileImage(null);
            setSelectedImage(null);
            Alert.alert('Profile image removed successfully!');
            setModalVisible(false);
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

    const styles = StyleSheet.create({
        container: {
            marginVertical: hp('2%'),
            alignItems: 'center'
        },
        avatarContainer: {
            position: 'relative'
        },
        scrollView: {
            backgroundColor: theme.backgroundColor
        },
        avatarSection: {
            marginVertical: 20,
            alignItems: 'center'
        },
        cameraButton: {
            position: 'absolute',
            bottom: wp('0%'),
            right: wp('0%'),
            padding: wp('2%'),
            borderRadius: wp('50%')
        },
        inputContainer: {
            marginHorizontal: 20,
            marginTop: 10,

        },
        label: {
            color: theme.textColor,
            fontSize: 16,
            marginBottom: 5,
            fontFamily: 'Poppins-Bold',
        },
        inputBox: (hasError) => ({
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.accentColor,
            height: 60,
            borderRadius: 10,
            paddingHorizontal: 15,
            borderColor: hasError ? 'red' : theme.accentColor,
            borderWidth: 1,
        }),
        textInput: {
            flex: 1,
            fontSize: 16,
            color: theme.textColor,
            marginLeft: 10,
            fontFamily: 'Poppins-Light',
        },
        submitButtonContainer: {
            alignItems: 'center'
            , marginVertical: 20
        },
        submitButton: {
            backgroundColor: '#4CAF50',
            borderRadius: 50,
            paddingVertical: 15,
            paddingHorizontal: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
        },
        submitButtonText: {
            fontSize: 20,
            color: '#FFF',
            fontWeight: 'bold'
        },
        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        },
        modalTitle: {
            textAlign: 'center',
            fontSize: wp('5%'),
            fontWeight: 'bold',
            marginBottom: hp('2%')
        },
    });

    return (
        <ScrollView style={styles.scrollView}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundColor} />

            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Avatar.Image source={{ uri: profileImage || 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg' }} size={wp('30%')} />
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.cameraButton, { backgroundColor: theme.backgroundColor }]}>
                        <Icon1 name="camera-outline" size={wp('6%')} color={theme.iconProfile} />
                    </TouchableOpacity>
                </View>
            </View>


            {/* All input fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputBox(errorFields.displayName)}>
                    <Icon name="account-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={displayName}
                        onChangeText={setDisplayName}
                        placeholder="Your name"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nick Name</Text>
                <View style={styles.inputBox(errorFields.description)}>
                    <Icon name="account-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Nick Name"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputBox(false)}>
                    <Icon name="email-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor={theme.textColor}
                        editable={false}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <View style={styles.inputBox(errorFields.phone)}>
                    <Icon name="phone-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Company</Text>
                <View style={styles.inputBox(errorFields.company)}>
                    <Icon name="office-building-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={company}
                        onChangeText={setCompany}
                        placeholder="Company"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Department</Text>
                <View style={styles.inputBox(errorFields.department)}>
                    <Icon name="account-group-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={department}
                        onChangeText={setDepartment}
                        placeholder="Department"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.submitButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSaveProfile} disabled={loading}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            )}

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

export default EditProfileScreen;
