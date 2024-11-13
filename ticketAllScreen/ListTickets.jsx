// Import statements
import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    Button,
    Platform,
    Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '@react-native-firebase/firestore';
import { UserContext } from '../api/UserContext';
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ตั้งค่าพร้อมเปิดใช้งาน persistence ก่อนสร้างอินสแตนซ์ firestore
import firestore from '@react-native-firebase/firestore';

firestore().settings({ persistence: true });


const CACHE_EXPIRY_MINUTES = 10;
const ITEMS_PER_PAGE = 50;

firebase.firestore().settings({ persistence: true });

const AllTickets = () => {
    const { email } = useContext(UserContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('Newest');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [totalFilteredTickets, setTotalFilteredTickets] = useState(0);




    const loadTicketsFromCache = async () => {
        try {
            const cachedTickets = await AsyncStorage.getItem('tickets');
            const cacheTime = await AsyncStorage.getItem('cacheTime');
            const now = new Date().getTime();
            if (cachedTickets && cacheTime && now - parseInt(cacheTime) < CACHE_EXPIRY_MINUTES * 60 * 1000) {
                return JSON.parse(cachedTickets);
            }
            return null;
        } catch (error) {
            console.error("Error loading tickets from cache:", error);
            return null;
        }
    };

    const saveTicketsToCache = async (tickets) => {
        try {
            await AsyncStorage.setItem('tickets', JSON.stringify(tickets));
            await AsyncStorage.setItem('cacheTime', Date.now().toString());
        } catch (error) {
            console.error("Error saving tickets to cache:", error);
        }
    };

    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);


        const fetchData = async () => {
            setLoading(true);

            // ลองโหลดข้อมูลจากแคชก่อน
            const cachedTickets = await loadTicketsFromCache();
            if (cachedTickets) {
                setTickets(cachedTickets);
                setFilteredTickets(cachedTickets);
                setLoading(false);
            }

            // กรณีที่ข้อมูลจากแคชหมดอายุหรือไม่มีในแคช ดึงข้อมูลใหม่จาก Firestore
            const unsubscribe = firebase.firestore().collection('tickets')
                .onSnapshot(snapshot => {
                    const ticketsData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setTickets(ticketsData);
                    setFilteredTickets(ticketsData);
                    saveTicketsToCache(ticketsData); // บันทึกข้อมูลลงแคช
                    setLoading(false);
                }, error => {
                    console.error("Error fetching tickets:", error);
                    setLoading(false);
                });

            return () => unsubscribe();
        };

        fetchData();
    }, []); // ลบ useEffect ที่ซ้ำซ้อนออก

    useEffect(() => {
        applyFilters();
    }, [searchQuery, tickets, page, sortOrder, categoryFilter, startDate, endDate]);

    const applyFilters = () => {
        let updatedTickets = tickets;

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            updatedTickets = updatedTickets.filter(ticket =>
                (ticket.id && ticket.id.toLowerCase().includes(lowercasedQuery)) ||
                (ticket.title && ticket.title.toLowerCase().includes(lowercasedQuery)) ||
                (ticket.userFullName && ticket.userFullName.toLowerCase().includes(lowercasedQuery)) ||
                (ticket.jobOwner && ticket.jobOwner.toLowerCase().includes(lowercasedQuery))
            );
        }

        if (startDate || endDate) {
            updatedTickets = updatedTickets.filter(ticket => {
                // ตรวจสอบว่าฟิลด์ createdAt มีอยู่และเป็น Timestamp หรือไม่
                const createdAt = ticket.createdAt && ticket.createdAt.toDate ? ticket.createdAt.toDate() : null;
                if (!createdAt) return false;
                return (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endDate);
            });
        }


        if (categoryFilter !== 'All') {
            updatedTickets = updatedTickets.filter(ticket => ticket.category === categoryFilter);
        }

        updatedTickets.sort((a, b) => {
            if (sortOrder === 'Newest') return b.createdAt - a.createdAt;
            if (sortOrder === 'Oldest') return a.createdAt - b.createdAt;
            return 0;
        });

        // สร้างตัวแปรเพื่อเก็บจำนวนของ updatedTickets ทั้งหมดก่อนแบ่งหน้า
        const totalFilteredTickets = updatedTickets.length;

        // แบ่งหน้า
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setFilteredTickets(updatedTickets.slice(startIndex, endIndex));

        // อัปเดตจำนวนทั้งหมดใน state เพื่อแสดงผล
        setTotalFilteredTickets(totalFilteredTickets);
    };



    const openModal = (ticket) => {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedTicket(null);
        setModalVisible(false);
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        setPage(1);
    };

    const handleNextPage = () => setPage(page + 1);
    const handlePrevPage = () => setPage(page > 1 ? page - 1 : 1);

    const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(currentDate);
    };

    const formatDate = (date) => date ? date.toLocaleDateString() : 'Select Date';

    const renderTicketItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.tableRow, { backgroundColor: item.status === 'Completed Late' ? '#ffe6e6' : 'white' }]}
            onPress={() => openModal(item)}
        >
            <Text style={styles.tableCell}>{item.id}</Text>
            <Text style={styles.tableCell}>{item.title}</Text>
            <Text style={styles.tableCell}>{formatDate(item.createdAt?.toDate())}</Text>
            <Text style={[styles.tableCell, { color: item.status === 'Completed' ? 'green' : item.status === 'Completed Late' ? 'red' : 'black' }]}>{item.status}</Text>
            <Text style={styles.tableCell}>{item.userFullName}</Text>
            <Text style={styles.tableCell}>{item.jobOwner}</Text>
            <Text style={styles.tableCell}>{formatDate(item.completionDate?.toDate()) || 'N/A'}</Text>
        </TouchableOpacity>
    );
    
    const openImageViewer = () => {
        if (selectedTicket.attachments && selectedTicket.attachments[0]) {
            setImageViewerVisible(true);
        } else {
            console.warn("Image source doesn't exist");
        }
    };

    const closeImageViewer = () => {
        setImageViewerVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Tickets ({totalFilteredTickets})</Text>


            <TextInput
                style={styles.searchInput}
                placeholder="Search by Job Number, Title, User, or Owner"
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
                    <Text style={styles.dateText}>{`Start Date: ${formatDate(startDate)}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
                    <Text style={styles.dateText}>{`End Date: ${formatDate(endDate)}`}</Text>
                </TouchableOpacity>
            </View>

            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                />
            )}
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                />
            )}

            <TouchableOpacity
                style={styles.sortFilterButton}
                onPress={() => setSortModalVisible(true)}
            >
                <Text style={styles.sortFilterButtonText}>Sort and Filter Options</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#FF5722" style={styles.loadingIndicator} />
            ) : (
                <View style={styles.container}>
                    {/* Scrollable Horizontal Container */}
                    <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
                        <View>
                            {/* Fixed Header */}
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Job Number</Text>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Title</Text>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Created Date</Text>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Status</Text>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>User Full Name</Text>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Job Owner</Text>
                                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Completion Date</Text>
                            </View>

                            {/* Scrollable Content */}
                            <FlatList
                                data={filteredTickets}
                                keyExtractor={(item) => item.id}
                                renderItem={renderTicketItem}
                                contentContainerStyle={{ paddingBottom: 10 }} // เพิ่ม padding ด้านล่างเพื่อให้พื้นที่ว่าง
                            />
                        </View>
                    </ScrollView>
                </View>







            )}

            {/* Pagination */}
            <View style={styles.paginationContainer}>
                <TouchableOpacity style={[styles.paginationButton, page === 1 && styles.disabledButton]} onPress={handlePrevPage} disabled={page === 1}>
                    <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageNumberText}>Page {page}</Text>
                <TouchableOpacity style={[styles.paginationButton, filteredTickets.length < ITEMS_PER_PAGE && styles.disabledButton]} onPress={handleNextPage} disabled={filteredTickets.length < ITEMS_PER_PAGE}>
                    <Text style={styles.paginationButtonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Sorting and Filtering Modal */}

            <Modal
                visible={sortModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.sortModalContent}>
                        <Text style={styles.sortModalTitle}>Select Sorting Option</Text>
                        <View style={styles.sortOptionContainer}>
                            <Text style={styles.columnTitle}>Date</Text>
                            <TouchableOpacity
                                style={[styles.optionButton, sortOrder === 'Newest' && styles.selectedOption]}
                                onPress={() => setSortOrder('Newest')}
                            >
                                <Text style={styles.optionText}>Newest</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.optionButton, sortOrder === 'Oldest' && styles.selectedOption]}
                                onPress={() => setSortOrder('Oldest')}
                            >
                                <Text style={styles.optionText}>Oldest</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sortOptionContainer}>
                            <Text style={styles.columnTitle}>Category</Text>
                            {['All', 'Hardware', 'Software', 'Network', 'User'].map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[styles.optionButton, categoryFilter === category && styles.selectedOption]}
                                    onPress={() => setCategoryFilter(category)}
                                >
                                    <Text style={styles.optionText}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => setSortModalVisible(false)}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Detail Modal */}
            {selectedTicket && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <ScrollView contentContainerStyle={styles.modalContent}>
                                <Text style={styles.modalTitle}>Ticket Details</Text>

                                <Text style={styles.sectionTitle}>Job Information</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Job Number:</Text> {selectedTicket.id}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Title:</Text> {selectedTicket.title}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Description:</Text> {selectedTicket.description}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Category:</Text> {selectedTicket.category}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Priority:</Text> {selectedTicket.priority}</Text>

                                <Text style={styles.sectionTitle}>Reporter Information</Text>
                                <Text style={styles.detail}><Text style={styles.label}>User Full Name:</Text> {selectedTicket.userFullName}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Nickname:</Text> {selectedTicket.userNickname}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Email:</Text> {selectedTicket.userEmail}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Phone:</Text> {selectedTicket.userPhone}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Company:</Text> {selectedTicket.company}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Department:</Text> {selectedTicket.department}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Employee ID:</Text> {selectedTicket.employeeID}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Role:</Text> {selectedTicket.role}</Text>

                                <Text style={styles.sectionTitle}>Job Owner Information</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Job Owner:</Text> {selectedTicket.jobOwner}</Text>

                                <Text style={styles.sectionTitle}>Time Information</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Created Date:</Text> {formatDate(selectedTicket.createdAt?.toDate())}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Due Date:</Text> {formatDate(selectedTicket.dueDate?.toDate()) || 'N/A'}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Completion Date:</Text> {formatDate(selectedTicket.completionDate?.toDate()) || 'N/A'}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Last Updated:</Text> {formatDate(selectedTicket.lastUpdated?.toDate()) || 'N/A'}</Text>

                                <Text style={styles.sectionTitle}>Status Information</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Status:</Text> {selectedTicket.status}</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Progress:</Text> {selectedTicket.progress}%</Text>
                                <Text style={styles.detail}><Text style={styles.label}>Resolution Notes:</Text> {selectedTicket.resolutionNotes}</Text>

                                {selectedTicket.attachments && (
                                    <>
                                        <Text style={styles.sectionTitle}>Attachments</Text>
                                        <TouchableOpacity onPress={openImageViewer}>
                                            <Image source={{ uri: typeof selectedTicket.attachments === 'string' ? selectedTicket.attachments : selectedTicket.attachments[0] }} style={styles.attachmentImage} />
                                        </TouchableOpacity>
                                    </>
                                )}


                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>



            )}
            {imageViewerVisible && selectedTicket.attachments && (
                <Modal visible={imageViewerVisible} transparent={true} onRequestClose={closeImageViewer}>
                    <ImageViewer
                        imageUrls={typeof selectedTicket.attachments === 'string' ? [{ url: selectedTicket.attachments }] : selectedTicket.attachments.map((url) => ({ url }))}
                        onSwipeDown={closeImageViewer}
                        enableSwipeDown={true}
                    />
                    <TouchableOpacity style={styles.fullImageCloseButton} onPress={closeImageViewer}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </Modal>
            )}


        </View>
    );
};

export default AllTickets;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    attachmentImage: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    fullImageCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#FF5722',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#333',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dateButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    dateText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sortFilterButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    sortFilterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableContainer: {
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tableHeader: {
        backgroundColor: '#28a745',
    },
    tableHeaderCell: {
        width: 120,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 5,
    },
    tableCell: {
        width: 120,
        textAlign: 'center',
        color: '#333',
        paddingVertical: 5,
        paddingHorizontal: 2,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    paginationButton: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#007BFF',
    },
    disabledButton: {
        backgroundColor: '#ddd',
    },
    paginationButtonText: {
        color: '#fff',
    },
    pageNumberText: {
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: '80%', // กำหนดความสูงให้สามารถเลื่อนได้
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 15,
    },
    detail: {
        fontSize: 16,
        marginVertical: 5,
        color: '#333',
    },
    label: {
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortModalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sortModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    sortOptionContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    columnTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
        textAlign: 'center',
    },
    optionButton: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#007BFF',
        borderColor: '#007BFF',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    confirmButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
