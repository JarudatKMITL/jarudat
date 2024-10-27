import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AuthContext } from '../navigations/AuthProvider.android';
import { UserContext } from '../api/UserContext';
import { useTheme } from '../components/ThemeContext';
import HomeCreacteTicket from '../screen/HomeCreacteTicket';

const UserTicketScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { role, email, profileImage } = useContext(UserContext);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp('5%'),
      backgroundColor: '#F5F5F5', // สีพื้นหลังตามดีไซน์ที่ต้องการ
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#003c82',
      borderRadius: wp('5%'),
      padding: wp('4%'),
      marginBottom: hp('3%'),
      marginTop: hp('5%'),
    },
    userInfo: {
      flex: 1,
      paddingLeft: wp('2%'),
    },
    greeting: {
      color: '#fff',
      fontSize: wp('4.5%'),
      fontWeight: 'bold',
      color: theme.textColor,
    },
    userName: {
      color: '#fff',
      fontSize: wp('4%'),
      marginTop: hp('0.5%'),
    },
    profileIcon: {
      width: wp('15%'),
      height: wp('15%'),
      padding: wp('2%'),
      borderRadius: wp('8%'),
    },
    sectionTitle: {
      fontSize: wp('5%'),
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: hp('2%'),
      color: '#333333',
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
      higth: wp('42%'),
      backgroundColor: '#FFFFFF',
      paddingVertical: hp('2%'),
      borderRadius: wp('4%'),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    serviceIcon: {
      width: wp('25%'),
      height: wp('25%'),
      marginBottom: hp('1%'),
    },
    serviceLabel: {
      fontSize: wp('3.8%'),
      textAlign: 'center',
      fontWeight: '600',
      color: '#333333',
    },
  });
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>สวัสดี</Text>
          <Text style={styles.userName}>คุณศิลปชัย สมชาย</Text>
        </View>
        <TouchableOpacity style={styles.profileIconContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <Text style={styles.sectionTitle}>การบริการ</Text>
      <View style={styles.services}>
        <View style={styles.serviceGrid}>
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('CreateTicket1')}>
            <Image source={require('../assets/images/create.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Create new ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <Image source={require('../assets/images/ticketOpen.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket Open</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceGrid}>
          <TouchableOpacity style={styles.serviceItem}>
            <Image source={require('../assets/images/inProgress.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <Image source={require('../assets/images/ticketss.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket Resolved</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserTicketScreen;

