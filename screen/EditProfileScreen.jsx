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
import { UserContext } from '../api/UserContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';
import NetInfo from '@react-native-community/netinfo';

import firestore from '@react-native-firebase/firestore';

const setupFirestorePersistence = async () => {
    try {
        await firestore().settings({ cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED });
        await firestore().enablePersistence();
        console.log("Offline persistence enabled");
    } catch (err) {
        if (err.code === 'failed-precondition') {
            console.log("Multiple tabs open, persistence can only be enabled in one tab at a time.");
        } else if (err.code === 'unimplemented') {
            console.log("The current environment does not support all of the features required to enable persistence");
        }
    }
};


const EditProfileScreen = ({ navigation }) => {
    const { theme, colorScheme } = useTheme();
    const { user } = useContext(AuthContext);
    const {
        profileImage, employeeID, displayName, email, phone, company, department, nickName,
        setProfileImage, setDisplayName, setPhone, setCompany, setDepartment, setNickName, refreshUserProfile
    } = useContext(UserContext);

    // Temporary states for form fields
    const [tempProfileImage, setTempProfileImage] = useState(profileImage);
    const [tempDisplayName, setTempDisplayName] = useState(displayName);
    const [tempPhone, setTempPhone] = useState(phone);
    const [tempCompany, setTempCompany] = useState(company);
    const [tempDepartment, setTempDepartment] = useState(department);
    const [tempNickName, setTempNickName] = useState(nickName);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [tempEmployeeID, setTempEmployeeID] = useState(employeeID);
    const [isConnected, setIsConnected] = useState(true);


    useEffect(() => {
        setupFirestorePersistence();

        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                //Alert.alert('Online', 'Your data will sync automatically.');
            }
        });

        return () => unsubscribeNetInfo();
    }, []);

    const handleSaveProfile = async () => {
        const errors = {
            displayName: !tempDisplayName.trim(),
            phone: !tempPhone,
            company: !tempCompany,
            department: !tempDepartment,
            nickName: !tempNickName,
            employeeID: !tempEmployeeID,
        };
        setErrorFields(errors);

        if (Object.values(errors).some(error => error)) {
            Alert.alert('Please fill out all required fields');
            return;
        }

        setLoading(true);
        // ตั้ง timeout 1 นาทีเพื่อตรวจสอบสถานะการโหลด
        const timeout = setTimeout(() => {
            if (loading) { // ถ้ายังคงโหลดหลังจากผ่านไป 1 นาที
                Alert.alert(
                    'Connection Issue',
                    'Please check your internet connection.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setLoading(false); // หยุดการโหลดเมื่อกด OK
                            }
                        }
                    ]
                );
            }
        }, 60000); // 1 นาที = 60000 มิลลิวินาที

        try {
            const userDocRef = firestore().collection('users').doc(user.email);
            let imageUrl = tempProfileImage;
            if (selectedImage) {
                imageUrl = await uploadImageToFirebase(selectedImage);
            }

            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {

                Alert.alert(
                    'Offline Mode',
                    'You are offline. Your changes will be saved and synced when you are online again.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Profile1') // ใส่ชื่อหน้าที่คุณต้องการนำทางไป
                        }
                    ]
                );

                setLoading(false);
            }

            await userDocRef.set({
                displayName: tempDisplayName,
                phone: tempPhone,
                company: tempCompany,
                department: tempDepartment,
                nickName: tempNickName,
                profileImage: imageUrl,
                employeeID: tempEmployeeID,
            }, { merge: true });

            setProfileImage(imageUrl);
            setDisplayName(tempDisplayName);
            setPhone(tempPhone);
            setCompany(tempCompany);
            setDepartment(tempDepartment);
            setNickName(tempNickName);
            setTempEmployeeID(tempEmployeeID);
            await refreshUserProfile();

            //Alert.alert('Success', 'Profile updated successfully');
            navigation.navigate('Profile1');
        } catch (error) {
            console.log('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    };
    // Error fields state for validation
    const [errorFields, setErrorFields] = useState({
        displayName: false,
        phone: false,
        company: false,
        department: false,
        nickName: false,
        employeeID: false,
    });

    useEffect(() => {
        // Initialize form fields from context values
        setTempProfileImage(profileImage);
        setTempDisplayName(displayName);
        setTempPhone(phone);
        setTempCompany(company);
        setTempDepartment(department);
        setTempNickName(nickName);
        setTempEmployeeID(employeeID);
    }, [profileImage, displayName, phone, company, department, nickName, employeeID]);

    // Function to upload image to Firebase Storage
    const uploadImageToFirebase = async (localPath) => {
        const filename = `${user.email}_profile_${new Date().getTime()}.jpg`;
        const storageRef = storage().ref(`profileImages/${filename}`);
        await storageRef.putFile(localPath);
        const url = await storageRef.getDownloadURL();
        return url;
    };

    // Select image from library
    const selectImageFromLibrary = () => {
        ImagePicker.openPicker({
            cropping: true,
            width: 300,
            height: 300,
        }).then(image => {
            setSelectedImage(image.path);
            setTempProfileImage(image.path);
            setModalVisible(false);
        }).catch(error => {
            if (error.message !== 'User cancelled image selection') {
                console.log('Error picking image:', error);
            }
        });
    };

    // Capture image with camera
    const takePhotoWithCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            cropperCircleOverlay: true,
            width: 300,
            height: 300,
        }).then(image => {
            setSelectedImage(image.path);
            setTempProfileImage(image.path);
            setModalVisible(false);
        }).catch(error => {
            if (error.message !== 'User cancelled image selection') {
                console.log('Error capturing image:', error);
            }
        });
    };

    // Remove profile image
    const handleRemoveProfileImage = async () => {
        try {
            const userDocRef = firebase.firestore().collection('users').doc(user.email);
            await userDocRef.update({ profileImage: null });
            await user.updateProfile({ photoURL: null });
            setTempProfileImage(null);
            setSelectedImage(null);
            Alert.alert('Profile image removed successfully!');
            setModalVisible(false);
        } catch (error) {
            console.log('Error removing profile image:', error);
            Alert.alert('Failed to remove profile image. Try again later.');
        }
    };





    const confirmRemoveImage = () => {
        Alert.alert(
            'Confirm Removal',
            'Are you sure you want to remove your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: handleRemoveProfileImage },
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
            alignItems: 'center',
            marginVertical: 20
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
                    <Avatar.Image source={{ uri: selectedImage || profileImage || 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59' }} size={wp('30%')} />
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
                        value={tempDisplayName}
                        onChangeText={setTempDisplayName}
                        placeholder="Your name"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nick Name</Text>
                <View style={styles.inputBox(errorFields.nickName)}>
                    <Icon name="account-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={tempNickName}
                        onChangeText={setTempNickName}
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
                        value={tempPhone}
                        onChangeText={setTempPhone}
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
                        value={tempCompany}
                        onChangeText={setTempCompany}
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
                        value={tempDepartment}
                        onChangeText={setTempDepartment}
                        placeholder="Department"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Employee ID</Text>
                <View style={styles.inputBox(errorFields.employeeID)}>
                    <Icon name="account-group-outline" color={theme.iconProfile} size={25} />
                    <TextInput
                        style={styles.textInput}
                        value={tempEmployeeID}
                        onChangeText={setTempEmployeeID}
                        placeholder="EmployeeID"
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
