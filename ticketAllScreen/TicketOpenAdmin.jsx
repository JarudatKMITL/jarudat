import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Image, RefreshControl } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly

const TicketOpen = () => {
  const { theme, toggleColorScheme } = useTheme(); // Accessing the theme and toggle function
  const [tickets, setTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [completionTime, setCompletionTime] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  // ฟังก์ชันคำนวณ dueDate
  const calculateDueDate = (category) => {
    const now = new Date();
    let hoursToAdd;

    switch (category) {
      case 'user':
        hoursToAdd = 2;
        break;
      case 'software':
        hoursToAdd = 4;
        break;
      case 'hardware':
        hoursToAdd = 72;
        break;
      case 'network':
        hoursToAdd = 24;
        break;
      default:
        hoursToAdd = 0;
    }

    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000); // เพิ่มชั่วโมงเป็น ms
  };


  const handleTimeInputChange = (value) => {
    // กำจัดตัวอักษรที่ไม่ใช่ตัวเลข
    let cleanedValue = value.replace(/[^0-9]/g, '');

    // ถ้าผู้ใช้กรอกเกิน 2 หลัก ให้ใส่ `:` อัตโนมัติ
    if (cleanedValue.length > 2) {
      cleanedValue = cleanedValue.slice(0, 2) + ':' + cleanedValue.slice(2, 4);
    }

    // กำหนดค่าให้ completionTime
    setCompletionTime(cleanedValue);
  };

  const handleConfirm = () => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // รูปแบบ HH:mm

    if (timePattern.test(completionTime)) {
      setCompletionModalVisible(false);
      acceptJob();
      setCompletionTime(''); // เคลียร์ค่า completionTime
    } else {
      Alert.alert('Invalid Format', 'Please enter a valid time in HH:mm format.');
    }
  };

  // ฟังก์ชันสลับการจัดเรียงตามวันที่
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder); // อัปเดต sortOrder
  };

  // ฟังก์ชันดึงข้อมูลตั๋วที่มีสถานะ "Pending" แบบเรียลไทม์
  useEffect(() => {
    const ticketsRef = firebase.firestore().collection('tickets')
      .where('status', '==', 'Pending')
      .orderBy('createdAt', sortOrder);

    const unsubscribe = ticketsRef.onSnapshot(querySnapshot => {
      const openTickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(openTickets);
      setOpenTicketsCount(openTickets.length);
    }, error => {
      console.error("Error fetching tickets:", error);
    });

    return () => unsubscribe(); // ล้างการสมัครใช้งานเมื่อ component ถูกยกเลิกการติดตั้ง
  }, [sortOrder]); // รันใหม่เมื่อ `sortOrder` เปลี่ยนแปลง

  // ฟังก์ชันรีเฟรชข้อมูลเพียงแค่ตั้งค่า refreshing ไม่ต้องคิวรี่ข้อมูลใหม่
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500); // ตั้งสถานะ refreshing เพียงช่วงสั้น ๆ
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCompletionModalVisible(false);
    setCompletionTime('');
    setSelectedJob(null);
  };

  const openCompletionModal = () => {
    setModalVisible(false);
    setCompletionModalVisible(true);
  };

  // ฟังก์ชันรับงาน
  const acceptJob = async () => {
    const currentAdminId = firebase.auth().currentUser.email;

    if (selectedJob) {
      try {
        const adminSnapshot = await firebase.firestore().collection('users').doc(currentAdminId).get();

        if (adminSnapshot.exists && adminSnapshot.data().role === 'admin') {
          const adminName = adminSnapshot.data().displayName;
          

          const dueDate = calculateDueDate(selectedJob.category); // คำนวณ dueDate

          const jobRef = firebase.firestore().collection('tickets').doc(selectedJob.id);
          await jobRef.update({
            status: 'In Progress',
            jobOwner: adminName || "ยังไม่ตั้งชื่อ", 
            jobOwnerEmail: currentAdminId , // เพิ่มอีเมลผู้รับงาน
            estimatedTime: completionTime || "Not specified", 
            lastUpdatedJobOwner: firebase.firestore.FieldValue.serverTimestamp(),
            dueDate: dueDate, // บันทึก dueDate ในฐานข้อมูล
          });
          console.log(adminName);

          setCompletionModalVisible(false);
        } else {
          Alert.alert('Error', 'Admin data not found or you do not have the right permissions.');
        }
      } catch (error) {
        console.log('Error updating job status:', error);
        Alert.alert('Error', 'Failed to accept the job. Please try again.');
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerRowItem}>
        <Text style={styles.jobNumber}>Job Number: {item.id}</Text>
        <Text style={styles.dateText}>
          Created At: {item.createdAt ? item.createdAt.toDate().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'N/A'}
        </Text>
      </View>
      <Text style={styles.jobName}>Job Name: {item.title}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.company}>Company: {item.company}</Text>
      <Text style={styles.status}>Status: <Text style={styles.statusOpen}>{item.status}</Text></Text>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.button}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );


  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },

    jobNumber: {
      fontFamily: 'Poppins-Bold',
      fontSize: wp('4.2%'),
      color: theme.textColor,
    },
    dateText: {
      fontFamily: 'Poppins-Medium',
      fontSize: wp('3.5%'),
      color: theme.text,
      marginTop: hp('0.5%'), // เพิ่มระยะห่างด้านบนเพื่อแยกบรรทัด
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('2%'),
      backgroundColor: theme.backgroundColor,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderRadius: wp('2%'),
      marginBottom: hp('1.5%'),
    },
    headerRowItem: {
      flexDirection: 'col',
      justifyContent: 'space-between',
      alignItems: 'left',
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('2%'),
      backgroundColor: theme.accentColor,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderRadius: wp('2%'),
      marginBottom: hp('1.5%'),
    },
    totalTicketsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    header: {
      fontFamily: 'Poppins-Bold',
      fontSize: wp('5%'),
      color: theme.textColor,
    },
    ticketCount: {
      fontFamily: 'Poppins-Bold',
      fontSize: wp('5%'),
      color: '#4CAF50', // ใช้สีเขียวสดใสให้ดูโดดเด่น
      marginLeft: wp('1%'),
    },
    sortButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: hp('0.8%'),
      paddingHorizontal: wp('4%'),
      borderRadius: wp('3%'),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    sortButtonText: {
      color: '#fff',
      fontSize: wp('3.5%'),
      fontFamily: 'Poppins-SemiBold',
      textTransform: 'uppercase',
    },
    listContent: {
      paddingHorizontal: wp('2%'),
      paddingBottom: hp('1%'),
    },
    itemContainer: {
      padding: wp('4%'),
      marginVertical: hp('1%'),
      marginHorizontal: wp('3%'),
      borderRadius: wp('3%'),
      backgroundColor: theme.accentColor,
      shadowColor: theme.textColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: wp('1%'),
      elevation: 3,
      borderWidth: 0.5,
      borderColor: '#ddd',
    },

    jobName: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: wp('4%'),
      color: theme.textColor,
      marginTop: hp('0.5%'),
    },
    category: {
      fontFamily: 'Poppins-Medium',
      fontSize: wp('3.8%'),
      color: theme.textColor,
      marginTop: hp('0.5%'),
    },
    company: {
      fontFamily: 'Poppins-Medium',
      fontSize: wp('3.8%'),
      color: theme.textColor,
      marginTop: hp('0.5%'),
    },
    status: {
      fontFamily: 'Poppins-Medium',
      fontSize: wp('4%'),
      color: theme.textColor,
      marginTop: hp('0.5%'),
    },
    statusOpen: {
      fontFamily: 'Poppins-Medium',
      color: '#28a745',
      fontWeight: 'bold',
    },
    button: {
      marginTop: hp('1%'),
      paddingVertical: hp('1.2%'),
      backgroundColor: '#007bff',
      borderRadius: wp('2%'),
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: wp('4%'),
      fontFamily: 'Poppins-SemiBold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: theme.accentColor,
      borderRadius: wp('3%'),
      padding: wp('5%'),
      maxHeight: '80%',
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: wp('2%'),
      elevation: 5,
    },
    scrollContent: {
      paddingVertical: hp('1%'),
    },
    modalTitle: {
      fontSize: wp('5.5%'),
      fontFamily: 'Poppins-Bold',
      marginBottom: hp('1%'),
      color: theme.textColor,
    },
    modalDetails: {
      fontSize: wp('4%'),
      fontFamily:'Anakotmai-Light',
      marginBottom: hp('0.8%'),
      color: theme.textColor,
    },
    image: {
      width: '100%',
      height: hp('25%'),
      marginVertical: hp('1%'),
      borderRadius: wp('2%'),
    },
    noImageText: {
      fontSize: wp('3.5%'),
      color: '#aaa',
      textAlign: 'center',
      marginVertical: hp('1%'),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp('2%'),
    },
    acceptButton: {
      flex: 1,
      marginLeft: wp('1%'),
      paddingVertical: hp('1.5%'),
      borderRadius: wp('3%'),
      backgroundColor: '#28a745',
      alignItems: 'center',
    },
    acceptButtonText: {
      color: '#fff',
      fontSize: wp('4%'),
      fontWeight: 'bold',
    },
    closeButton: {
      flex: 1,
      marginRight: wp('1%'),
      paddingVertical: hp('1.5%'),
      borderRadius: wp('3%'),
      backgroundColor: '#dc3545',
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: wp('4%'),
      fontWeight: 'bold',
    },
    noTicketsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp('2%'),
    },
    noTicketsText: {
      fontSize: wp('5%'),
      color: theme.text,
      textAlign: 'center',
    },

    //แยก
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    completionModalContent: {
      width: '90%',
      padding: wp('5%'),
      backgroundColor: theme.accentColor,
      borderRadius: wp('3%'),
      maxHeight: '60%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: wp('5%'),
      fontFamily: 'Poppins-Bold',
      color: theme.textColor,
      marginBottom: hp('2%'),
    },
    completionInput: {
      width: '100%',
      padding: wp('3%'),
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: wp('2%'),
      fontSize: wp('4%'),
      fontFamily: 'Poppins-Medium',
      color: theme.textColor,
      marginBottom: hp('2%'),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: hp('2%'),
    },
    closeButton: {
      flex: 1,
      marginRight: wp('1%'),
      paddingVertical: hp('1.5%'),
      borderRadius: wp('3%'),
      backgroundColor: '#dc3545',
      alignItems: 'center',
    },
    acceptButton: {
      flex: 1,
      marginLeft: wp('1%'),
      paddingVertical: hp('1.5%'),
      borderRadius: wp('3%'),
      backgroundColor: '#28a745',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: wp('4%'),
      fontFamily: 'Poppins-SemiBold',
    },

  });




  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.totalTicketsContainer}>
          <Text style={styles.header}>Total Tickets: </Text>
          <Text style={styles.ticketCount}>{openTicketsCount}</Text>
        </View>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            Sort by Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </Text>
        </TouchableOpacity>
      </View>

      {tickets.length > 0 ? (
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.noTicketsContainer}>
          <Text style={styles.noTicketsText}>No Tickets Available</Text>
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {selectedJob && (
                <>
                  <Text style={styles.modalTitle}>{selectedJob.title || 'No name available'}</Text>
                  <Text style={styles.modalDetails}>Description : {selectedJob.descriptions || 'No description available'}</Text>
                  <Text style={styles.modalDetails}>Job Number : {selectedJob.id || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Category : {selectedJob.category || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Priority : {selectedJob.priority || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Location : {selectedJob.location || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>ชื่อผู้แจ้ง : {selectedJob.displayName || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>ชื่อเล่น : {selectedJob.description || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Email : {selectedJob.userEmail || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>เบอร์ติดต่อ : {selectedJob.phone || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Company : {selectedJob.company || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Department : {selectedJob.department || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>
                    Created At : {selectedJob.createdAt ? selectedJob.createdAt.toDate().toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    }) : 'N/A'}
                  </Text>

                  {selectedJob.attachments ? (
                    <>
                      <Image
                        source={{ uri: selectedJob.attachments }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </>
                  ) : (
                    <Text style={styles.noImageText}>No image available</Text>
                  )}
                </>
              )}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={openCompletionModal}>
                <Text style={styles.acceptButtonText}>Accept Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={completionModalVisible} animationType="slide" transparent={true} onRequestClose={() => setCompletionModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.completionModalContent}>
            <Text style={styles.modalTitle}>Set Estimated Completion Time (HH:mm)</Text>
            <TextInput
              style={styles.completionInput}
              placeholder="Enter time (HH:mm)"
              placeholderTextColor={theme.textColor}
              value={completionTime}
              onChangeText={handleTimeInputChange}
              keyboardType="numeric"
              maxLength={5} // จำกัดให้ไม่เกิน 5 ตัวอักษร
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setCompletionModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>

  );
};

export default TicketOpen;

























