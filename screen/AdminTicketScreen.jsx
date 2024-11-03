import { StatusBar, Button, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AuthContext } from '../navigations/AuthProvider.android';
import { UserContext } from '../api/UserContext';
import { useTheme } from '../components/ThemeContext';

const AdminTicketScreen = ({ navigation }) => {
  const { role, email, profileImage, displayName } = useContext(UserContext);
  const { theme, toggleColorScheme, colorScheme } = useTheme();

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
      backgroundColor: theme.bghTicket,
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
      fontSize: wp('5%'),
      fontFamily: 'Poppins-Bold',
    },
    userName: {
      color: '#fff',
      fontSize: wp('4%'),
      marginTop: hp('0.5%'),
      fontFamily: 'Poppins-SemiBlod',
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
      color: theme.textColor,
      fontFamily: 'Poppins-Bold',
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
      backgroundColor: theme.serviceT,
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
      fontSize: wp('4%'),
      textAlign: 'center',
      fontWeight: '600',
      color: theme.textColor,
      fontFamily: 'Popins-Medium'
    },
  });


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} // or "dark-content"
        backgroundColor={theme.backgroundColor} // Set this to match your header
      />
      {/* Header */} 
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileIconContainer}
          onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile1' })}
        >
          <Image
            source={{ uri: profileImage }}
            style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.services}>
        <View style={styles.serviceGrid}>
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('CreateTicket1')}>
            <Image source={require('../assets/images/create.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Create new ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('TakeOwnership')}>
            <Image source={require('../assets/images/ticketOpen.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Take Ownership</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceGrid}>
          <TouchableOpacity style={styles.serviceItem}
            onPress={() => navigation.navigate('InProgress')}>
            <Image source={require('../assets/images/inProgress.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket In Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <Image source={require('../assets/images/ticketss.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket Resolved</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceGrid}>
          <TouchableOpacity style={styles.serviceItem}>
            <Image source={require('../assets/images/listTicket.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <Image source={require('../assets/images/sumTicket.png')} style={styles.serviceIcon} />
            <Text style={styles.serviceLabel}>Ticket Summary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminTicketScreen;

