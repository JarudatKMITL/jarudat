
import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Animated,
    Image,
    PermissionsAndroid,
    Alert,
    Linking,
    Platform,
    ScrollView,
    ActivityIndicator

} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Picker } from '@react-native-picker/picker';
import { firebase } from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from 'react-native-fs';
import { UserContext } from '../api/UserContext';
import { useTheme } from '../components/ThemeContext';

const ResolvedTickets = () => {
    const { role, email, profileImage, displayName, empolyeeID } = useContext(UserContext);

    const [progress, setProgress] = useState('');
    const [jobsProgress, setJobsProgress] = useState([]);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isOrderModalVisible, setOrderModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('In Progress');
    const [selectedDateSort, setSelectedDateSort] = useState('Newest');
    const [selectedCategorySort, setSelectedCategorySort] = useState('All');
    const categories = ['All', 'Hardware', 'Software', 'Network', 'User'];
    const [loading, setLoading] = useState(false); // สถานะการโหลด
    const [seeMore, setSeeMore] = useState(false);
    

    const handleUpdate = async () => {
        if (!selectedJob) return;

        // ถ้า selectedStatus เป็น "Completed" ตั้งค่า progress เป็น 100%
        if (selectedStatus === "In Progress") {
            progressValue = 80;
        }
        setUpdateModalVisible(false);
        setLoading(true); // เริ่มการโหลด

        try {
            const jobRef = firebase.firestore().collection('tickets').doc(selectedJob.id);

            await jobRef.update({
                status: selectedStatus,
                progress: progressValue,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            });

            // รีเฟรชข้อมูลของ selectedJob หลังบันทึก
            const updatedSnapshot = await jobRef.get();
            const updatedData = updatedSnapshot.data();
            setSelectedJob({ id: selectedJob.id, ...updatedData });

        } catch (error) {
            console.error("Error updating job:", error);
            Alert.alert("Error", "Failed to update the job. Please try again.");
        } finally {
            setLoading(false); // จบการโหลด

        }
    };

    // ดึงข้อมูลที่มีสถานะ "In Progress" ครั้งเดียวเมื่อ component โหลด
    useEffect(() => {
        const ticketsRef = firebase.firestore().collection('tickets')
            .where('status', 'in', ['Completed', 'Completed Late'])
            .where('jobOwnerEmail', '==', email)
            .limit(50); // จำกัดจำนวนข้อมูลที่ดึงมาในครั้งแรก

        const unsubscribe = ticketsRef.onSnapshot(querySnapshot => {
            const inProgressTickets = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                dueDate: doc.data().dueDate ? doc.data().dueDate.toDate() : null,
                createdAt: doc.data().createdAt.toDate(),
            }));
            setJobsProgress(inProgressTickets);
        }, error => {
            console.error("Error fetching tickets:", error);
        });

        return () => unsubscribe();
    }, [email]);

    // กรองและเรียงลำดับข้อมูลในเครื่อง
    const filteredJobs = jobsProgress
        .filter(job => selectedCategorySort === 'All' || job.category === selectedCategorySort)
        .sort((a, b) => {
            if (selectedDateSort === 'Newest') {
                return b.createdAt - a.createdAt;
            } else {
                return a.createdAt - b.createdAt;
            }
        });

    const handleConfirmSort = () => {
        setOrderModalVisible(false);
    };

    // ฟังก์ชันเปิด Modal รายละเอียดงาน
    const openModal = (job) => {
        setSelectedJob(job);
        setModalVisible(true); // แสดง Modal
    };

    // ฟังก์ชันปิด Modal รายละเอียดงาน
    const closeModal = () => {
        setSelectedJob(null);
        setModalVisible(false); // ซ่อน Modal
    };

    const openImageModal = () => {
        setImageModalVisible(true);
    };

    const closeImageModal = () => {
        setImageModalVisible(false);
    };

    const openUpdateModal = () => {
        setUpdateModalVisible(true);
        setModalVisible(false); // ซ่อน Modal

    };

    const closeUpdateModal = () => {
        setUpdateModalVisible(false);
    };

    const requestStoragePermission = async () => {
        try {
            if (Platform.OS === 'android') {
                let permissionType;
                if (Platform.Version >= 33) { // Android 13 ขึ้นไป
                    permissionType = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
                } else if (Platform.Version >= 30) { // Android 11 - 12
                    permissionType = PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE;
                } else { // Android 10 และต่ำกว่า
                    permissionType = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
                }

                console.log("Requesting permission:", permissionType);

                const granted = await PermissionsAndroid.request(permissionType, {
                    title: 'Storage Permission',
                    message: 'This app needs access to your storage to save photos',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });

                console.log("Granted:", granted);

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true; // สำหรับ iOS หรือแพลตฟอร์มอื่นๆ ที่ไม่ต้องขอสิทธิ์
        } catch (err) {
            console.warn("Request permission error: ", err);
            return false;
        }
    };

    const saveImageFromUrl = async (imageUrl) => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Cannot save the image without permission.');
            return;
        }

        try {
            // สร้างเส้นทางที่ไม่ซ้ำกันสำหรับบันทึกรูปภาพในเครื่องโดยใช้ timestamp
            const timestamp = new Date().getTime();
            const localFilePath = `${RNFS.DocumentDirectoryPath}/image-${timestamp}.jpg`;

            // ดาวน์โหลดรูปภาพจาก URL
            const response = await RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: localFilePath,
            }).promise;

            if (response.statusCode === 200) {
                // บันทึกภาพไปยังแกลเลอรี
                await CameraRoll.save(localFilePath, { type: 'photo' });
                Alert.alert('Success', 'Image saved to gallery!');
            } else {
                Alert.alert('Error', 'Failed to download image.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save image: ' + error.message);
        }
    };
    
    // ฟังก์ชันดาวน์โหลดรูปภาพเมื่อกดค้างที่รูปภาพ
    // ฟังก์ชันแสดง Alert เพื่อยืนยันก่อนบันทึกรูปภาพ
    const handleLongPressDownload = () => {
        if (selectedJob?.attachments) {
            Alert.alert(
                'Download Image',
                'Do you want to download this image to your gallery?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Confirm', onPress: () => saveImageFromUrl(selectedJob.attachments) },
                ],
                { cancelable: true }
            );
        } else {
            Alert.alert('Error', 'No image available to download.');
        }
    };

    const JobCard = ({ item, openModal }) => {
        
        // ตรวจสอบและปรับค่า hours และ minutes ก่อนแสดงผล
        const formattedProcessingTime = () => {
            const hours = item.processingTimeHours || 0; // สมมุติว่า item.processingTimeHours เก็บค่าชั่วโมง
            const minutes = item.processingTimeMinutes || 0; // สมมุติว่า item.processingTimeMinutes เก็บค่านาที

            const displayHours = hours > 0 ? `${hours} ชม.` : '';
            const displayMinutes = minutes > 0 ? `${minutes} นาที` : '1 นาที';

            return `${displayHours} ${displayMinutes}`.trim();
        };

        return (
            <TouchableOpacity onPress={() => openModal(item)} style={styles.jobCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    {/* แสดงสถานะ โดยใช้สีตามสถานะ */}
                    <Text
                        style={[
                            styles.jobDetails,
                            { color: item.status === 'Completed' ? 'green' : item.status === 'Completed Late' ? 'red' : 'black' },
                        ]}
                    >
                        {item.status}
                    </Text>

                </View>
                <Text style={styles.jobDetails}><Text style={styles.fontBold}>Job Number:</Text> {item.id}</Text>
                <Text style={styles.jobDetails}><Text style={styles.fontBold}>Category:</Text> {item.category}</Text>
                <Text style={styles.jobDetails}>
                    <Text style={styles.fontBold}>Completion Date: </Text>
                    {item.completionDate ? item.completionDate.toDate().toLocaleString() : 'No completion date'}
                </Text>
                <Text style={styles.jobDetails}>
                    <Text style={styles.fontBold}>Processing Time:</Text> {formattedProcessingTime()}
                </Text>

            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => <JobCard item={item} openModal={openModal} />;

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FF5722" />
                    <Text style={styles.loadingText}>Updating...</Text>
                </View>
            )}
            <View style={styles.headerRow}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Resolved Jobs: {filteredJobs.length}</Text>
                </View>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setOrderModalVisible(true)}
                >
                    <Text style={styles.sortButtonText}>Sort Options</Text>
                </TouchableOpacity>
            </View>

            {filteredJobs.length > 0 ? (
                <FlatList
                    data={filteredJobs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.noJobInProgressContainer}>
                    <Text style={styles.noJobInProgressText}>No Tickets Available</Text>
                </ScrollView>
            )}
            <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
                <View style={styles.modalBackground}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.detailModalContent}>
                            <Text style={styles.detailModalTitle}>{selectedJob?.title || 'Job Details'}</Text>
                            <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Job number: </Text>{selectedJob?.id}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Description: </Text> {selectedJob?.descriptions}</Text>
                            </View>
                            <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Category: </Text> {selectedJob?.category}</Text>
                            <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Priority: </Text> {selectedJob?.priority}</Text>
                            <Text style={styles.detailModalDetails}>
                                <Text style={styles.fontBold}>Due Date: </Text>
                                {selectedJob?.dueDate ? selectedJob.dueDate.toLocaleString() : 'No due date'}
                            </Text>
                            <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Progress: </Text> {selectedJob?.progress}%</Text>

                            <TouchableOpacity style={styles.seeMoreButton} onPress={() => setSeeMore(!seeMore)}>
                                <Text style={styles.seeMoreButtonText}>{seeMore ? 'ซ่อนข้อมูล' : 'ดูเพิ่มเติม'}</Text>
                            </TouchableOpacity>

                            {seeMore && (
                                <View>
                                    <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Create At: </Text>{selectedJob?.createdAt ? selectedJob.createdAt.toLocaleString() : 'No due date'}</Text>
                                    <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>ชื่อผู้แจ้ง: </Text> {selectedJob?.displayName}</Text>
                                    <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>ชื่อเล่น: </Text> {selectedJob?.nickName}</Text>
                                    <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Phone: </Text> {selectedJob?.phone}</Text>
                                    <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Company: </Text> {selectedJob?.company}</Text>
                                    <Text style={styles.detailModalDetails}><Text style={styles.fontBold}>Department: </Text> {selectedJob?.department}</Text>

                                    {selectedJob?.attachments && (
                                        <TouchableOpacity onPress={openImageModal} onLongPress={handleLongPressDownload}>
                                            <Image
                                                source={{ uri: selectedJob.attachments }}
                                                style={styles.jobImage}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            <View style={styles.detailButtonContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.updateButton} onPress={openUpdateModal}>
                                    <Text style={styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Modal visible={imageModalVisible} transparent={true} onRequestClose={closeImageModal}>
                            <ImageViewer
                                imageUrls={[{ url: selectedJob?.attachments }]}
                                onCancel={closeImageModal}
                                enableSwipeDown
                            />
                        </Modal>
                    </ScrollView>
                </View>
            </Modal>



            <Modal visible={updateModalVisible} animationType="fade" transparent={true} onRequestClose={closeUpdateModal}>
                <View style={styles.detailModalContainer}>
                    <View style={styles.updateModalContent}>
                        <Text style={styles.updateModalTitle}>Edit Job</Text>
                        <Picker
                            selectedValue={selectedStatus}
                            style={styles.picker}
                            onValueChange={(itemValue) => {
                                setSelectedStatus(itemValue);
                                if (itemValue === 'Completed') setProgress('100'); // ตั้งค่า progress เป็น 100 เมื่อสถานะเป็น Completed
                            }}
                        >
                            <Picker.Item label="In Progress" value="In Progress" />
                            <Picker.Item label="Completed" value="Completed" />
                        </Picker>
                        <View style={styles.updateButtonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={closeUpdateModal}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isOrderModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setOrderModalVisible(false)}
            >
                <View style={modalStyles.modalContainer}>
                    <View style={modalStyles.modalContent}>
                        <Text style={modalStyles.modalTitle}>Select Sorting Option</Text>
                        <View style={modalStyles.sortOptionsContainer}>
                            <View style={modalStyles.optionColumn}>
                                <Text style={modalStyles.columnTitle}>Date</Text>
                                <TouchableOpacity
                                    style={[
                                        modalStyles.optionButton,
                                        selectedDateSort === 'Newest' && modalStyles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedDateSort('Newest')}
                                >
                                    <Text
                                        style={[
                                            modalStyles.optionText,
                                            selectedDateSort === 'Newest' && modalStyles.selectedOptionText,
                                        ]}
                                    >
                                        Newest
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        modalStyles.optionButton,
                                        selectedDateSort === 'Oldest' && modalStyles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedDateSort('Oldest')}
                                >
                                    <Text
                                        style={[
                                            modalStyles.optionText,
                                            selectedDateSort === 'Oldest' && modalStyles.selectedOptionText,
                                        ]}
                                    >
                                        Oldest
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={modalStyles.optionColumn}>
                                <Text style={modalStyles.columnTitle}>Category</Text>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            modalStyles.optionButton,
                                            selectedCategorySort === category && modalStyles.selectedOption,
                                        ]}
                                        onPress={() => setSelectedCategorySort(category)}
                                    >
                                        <Text
                                            style={[
                                                modalStyles.optionText,
                                                selectedCategorySort === category && modalStyles.selectedOptionText,
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={modalStyles.closeButton}
                            onPress={handleConfirmSort}
                        >
                            <Text style={modalStyles.closeButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#f5f5f5',
    },
    noJobInProgressContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('2%'),
    },
    noJobInProgressText: {
        fontSize: wp('5%'),
        color: '#000',
        textAlign: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(70, 130, 180, 0.8)', // สีน้ำเงินโปร่งแสง
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    statusBarContainer: {
        width: '100%',
        height: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 5,
    },
    statusBar: {
        height: '100%',
        borderRadius: 5,
    },
    loadingText: {
        marginTop: 10,
        color: '#FF5722', // สีส้มสดใส
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    jobImage: {
        width: '100%',               // ให้เต็มความกว้างของ Modal
        height: 200,                 // กำหนดความสูง
        borderRadius: 10,            // มุมโค้ง
        marginVertical: 10,          // เว้นระยะด้านบนและล่าง
    },
    fontBold: {
        fontFamily: 'Anakotmai-Bold'
    },
    seeMoreButton: {
        backgroundColor: '#007bff',       // พื้นหลังสีน้ำเงิน
        paddingVertical: 8,               // ระยะขอบด้านบนและล่าง
        paddingHorizontal: 15,            // ระยะขอบด้านข้าง
        borderRadius: 5,                  // มุมโค้ง
        alignSelf: 'flex-start',          // จัดปุ่มให้อยู่ด้านซ้าย
        marginVertical: 10,               // เว้นระยะด้านบนและล่าง
    },
    seeMoreButtonText: {
        fontSize: 16,                     // ขนาดตัวอักษร
        color: '#fff',                    // สีตัวอักษรขาว
        fontWeight: 'bold',               // ตัวหนา
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    headerTitleContainer: {
        borderRadius: 20,
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
        marginRight: wp('2%'),
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: '#000',
    },
    sortButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
    },
    sortButtonText: {
        color: '#ffffff',
        fontSize: wp('4.5%'),
        fontWeight: '600',
    },

    listContent: {
        paddingBottom: hp('5%'),
        marginTop: hp('4%'),
    },
    jobCard: {
        backgroundColor: '#ffffff',
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        borderRadius: wp('2%'),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: wp('1%'),
        elevation: 2,

    },
    jobTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: hp('0.5%'),
    },

    detailModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // ทำให้ background โปร่งแสง
        justifyContent: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },




    // detail
    detailModalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: wp('4%'),
        paddingVertical: hp('3%'),
        paddingHorizontal: wp('5%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: wp('2%'),
    },
    detailModalTitle: {
        fontSize: wp('5.5%'),
        fontFamily: 'Anakotmai-Bold',
        color: '#333333',
        textAlign: 'left',
        marginBottom: hp('2%'),

    },
    detailModalDetails: {
        fontSize: wp('4%'),
        color: '#666666',
        marginBottom: hp('0.3%'),
        textAlign: 'left',
        flexWrap: 'wrap',       // เพิ่มการห่อบรรทัด
        width: '100%',          // กำหนดความกว้างให้เต็ม
        fontFamily: 'Anakotmai-Light'

    },
    detailButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        gap: wp('5%'),
    },
    updateButton: {
        backgroundColor: '#007bff',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        flex: 1,
        marginRight: wp('1%'),
        alignItems: 'center',
    },
    closeButton: {

        backgroundColor: '#dc3545',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        flex: 1,
        marginLeft: wp('1%'),
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    updateModalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: wp('3%'),
        padding: wp('5%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: wp('1%'),
    },
    updateModalTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
    input: {
        height: hp('6%'),
        borderColor: '#dddddd',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('3%'),
        marginBottom: hp('2%'),
        fontSize: wp('4%'),
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: hp('6%'),
        borderColor: '#dddddd',
        borderWidth: 1,
        borderRadius: wp('2%'),
        marginBottom: hp('2%'),
        backgroundColor: '#f9f9f9',
        fontSize: wp('4%'),
    },
    updateButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff6347',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        width: '45%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#ffffff',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    // แก้ไข

});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sortOptionsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    optionColumn: {
        width: '45%',
        alignItems: 'center',
    },
    columnTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 10,
        width: '100%',
    },
    selectedOption: {
        backgroundColor: '#0066cc',
        borderColor: '#0066cc',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
    },
    selectedOptionText: {
        color: '#ffffff',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#cccccc',
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333333',
    },
    openButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    openButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default ResolvedTickets;
