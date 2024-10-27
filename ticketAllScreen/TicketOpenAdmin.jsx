import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Image } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';

const TicketOpen = () => {
  const [tickets, setTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // ฟังก์ชันดึงข้อมูลตั๋วที่มีสถานะ "open"
  const fetchOpenTickets = async () => {
    try {
      const ticketsRef = firebase.firestore().collection('tickets');
      const querySnapshot = await ticketsRef.where('status', '==', 'open').get();

      const openTickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTickets(openTickets);
    } catch (error) {
      console.log('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchOpenTickets();  // เรียกฟังก์ชันเมื่อ component โหลดครั้งแรก
  }, []);

  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  // ฟังก์ชันรับงาน อัปเดตสถานะและรีเฟรชข้อมูล
  const acceptJob = async () => {
    if (selectedJob) {
      try {
        const jobRef = firebase.firestore().collection('tickets').doc(selectedJob.id);
        await jobRef.update({ status: 'accepted' });

        Alert.alert('Success', 'The job has been accepted.');
        closeModal();  // ปิด Modal หลังจากอัปเดตสำเร็จ
        fetchOpenTickets();  // รีเฟรชข้อมูลหลังจากอัปเดต
      } catch (error) {
        console.log('Error updating job status:', error);
        Alert.alert('Error', 'Failed to accept the job. Please try again.');
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.jobNumber}>Job Number: {item.id}</Text>
        <Text style={styles.dateText}>
          Created At: {item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      <Text style={styles.jobName}>Job Name: {item.displayName}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.company}>Company: {item.company}</Text>
      <Text style={styles.status}>Status: <Text style={styles.statusOpen}>open</Text></Text>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.button}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My tickets open</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

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
                  <Text style={styles.modalTitle}>{selectedJob.displayName || 'No name available'}</Text>
                  <Text style={styles.modalDetails}>Job Number: {selectedJob.id || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Category: {selectedJob.category || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Company: {selectedJob.company || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Description: {selectedJob.description || 'No description available'}</Text>
                  <Text style={styles.modalDetails}>Created At: {selectedJob.createdAt?.toDate().toLocaleString() || 'N/A'}</Text>
                  <Text style={styles.modalDetails}>Last Updated: {selectedJob.lastUpdated?.toDate().toLocaleString() || 'N/A'}</Text>
                  {selectedJob.attachments ? (
                    <>
                      <Text style={styles.modalDetails}>Image URL:</Text>
                      <Text style={styles.modalDetails}>{selectedJob.attachments}</Text>
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
              <TouchableOpacity style={styles.acceptButton} onPress={acceptJob}>
                <Text style={styles.acceptButtonText}>Accept Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  jobNumber: { fontWeight: 'bold', marginBottom: 4 },
  jobName: { fontSize: 16, marginBottom: 4, color: '#333' },
  category: { fontSize: 14, marginBottom: 4, color: '#666' },
  company: { fontSize: 14, marginBottom: 4, color: '#666' },
  status: { fontSize: 14, color: '#666', marginBottom: 8 },
  statusOpen: { color: '#28a745', fontWeight: 'bold' },
  button: {
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  modalDetails: { fontSize: 16, marginBottom: 8, color: '#555' },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
  },
  noImageText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  acceptButton: {
    flex: 1,
    marginLeft: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    flex: 1,
    marginRight: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#dc3545',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
});

export default TicketOpen;
