import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Alert, View, Modal, Pressable, TouchableOpacity, Switch, StatusBar, ScrollView, Button, RefreshControl } from 'react-native';
import { Avatar, Title, Caption, Text, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../components/ThemeContext'; // Adjust the path accordingly
import { AuthContext } from "../navigations/AuthProvider";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UserContext } from '../api/UserContext';

const HomeProfileScreen = () => {
  const { theme, toggleColorScheme, colorScheme } = useTheme(); // Accessing the theme and toggle function
  const { user, logout } = useContext(AuthContext);
  const { role, employeeID, email, profileImage, displayName, nickName, phone, company, department, refreshUserProfile } = useContext(UserContext);

  useEffect(() => {
    // Automatically refresh the component when the context data changes
  }, [role, email, profileImage, displayName, nickName, phone, company, department]);

  const [refreshing, setRefreshing] = useState(false); // สถานะการรีเฟรช
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserProfile(); // รีเฟรชข้อมูลใน context
    console.log('รีเฟชสำเร็จ')
    setRefreshing(false);
  };
  const styles = StyleSheet.create({
    // Main containers
    scrollView: {
      backgroundColor: theme.backgroundColor
    },
    container: {
      marginVertical: hp('2%'),
      alignItems: 'center'
    },
    avatarContainer: {
      position: 'relative'
    },
    profileTextContainer: {
      marginTop: hp('2%'),
      alignItems: 'center'
    },
    sectionContainer: {
      marginHorizontal: wp('5%'),
      marginBottom: hp('2%')
    },

    // Text styles
    titleText: {
      fontSize: wp('5.5%'),
      fontFamily: 'Poppins-Bold',
    },
    captionText: {
      fontSize: wp('4%'),
      fontFamily: 'Poppins-Medium',
    },
    sectionHeaderText: {
      fontSize: wp('5%'),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      marginBottom: 10,
    },
    itemText: {
      fontSize: wp('4%'),
      marginLeft: wp('3%'),
      marginRight: 16,
      fontFamily: 'Poppins-Light',

    },
    modalTitle: {
      textAlign: 'center',
      fontSize: wp('5%'),
      fontWeight: 'bold',
      marginBottom: hp('2%')
    },
    iconText: {
      marginTop: hp('1%'),
      fontSize: wp('3.5%')
    },

    // Item containers
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.accentColor,
      height: hp('8%'),
      marginBottom: hp('0.5%')
    },
    itemTopRounded: {
      borderTopLeftRadius: wp('2%'),
      borderTopRightRadius: wp('2%')
    },
    itemBottomRounded: {
      borderBottomLeftRadius: wp('2%'),
      borderBottomRightRadius: wp('2%')
    },
    itemLeft: {
      flexDirection: 'row',
      marginLeft: wp('5%'),
      alignItems: 'center'
    },

    // Button and Icon styles
    cameraButton: {
      position: 'absolute',
      bottom: wp('0%'),
      right: wp('0%'),
      padding: wp('2%'),
      borderRadius: wp('50%')
    },
    iconRight: {
      marginRight: wp('5%')
    },
    iconButton: {
      alignItems: 'center'
    },
    switch: {
      transform: [{ scaleX: wp('0.4') }, { scaleY: wp('0.4') }],
      marginRight: wp('5%')
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
    }
  });

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: theme.backgroundColor }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.backgroundColor} />
      {/* Profile Header */}
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image source={{
            uri: profileImage || 'https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_ohc=ks_dq1OtD9AQ7kNvgEd-JFx&_nc_zt=24&_nc_ht=scontent.fbkk5-1.fna&edm=AHgPADgEAAAA&_nc_gid=AyPkfzVhyf7oK1oDNQ6zMHF&oh=00_AYDWFYopKE52e6IZqZVk3JRj88lyMsOjagrsXHoyIOMpTA&oe=673B3E59'
          }} size={wp('30%')} />

        </View>
        <View style={styles.profileTextContainer}>
          <Title style={[styles.titleText, { color: theme.textColor }]}>{displayName}</Title>
          <Caption style={[styles.captionText, { color: theme.textColor }]}>{role} : {nickName ? nickName : 'null'}</Caption>
        </View>
      </View>

      {/* Personal Info */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeaderText, { color: theme.textColor }]}>Personal Info</Text>
        <View style={[styles.itemContainer, styles.itemTopRounded]}>
          <View style={styles.itemLeft}>
            <Icon name="email-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Email : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{email ? email : 'Null'}</Text>
        </View>

        {/* Additional Info Items */}
        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Icon name="phone-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Phone : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{phone ? phone : 'Null'}</Text>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Icon name="city-variant-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Company : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{company ? company : 'Null'}</Text>
        </View>

        <View style={[styles.itemContainer, styles.itemBottomRounded]}>
          <View style={styles.itemLeft}>
            <Icon name="heart-circle-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Department : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{department ? department : 'Null'}</Text>
        </View>

        <View style={[styles.itemContainer, styles.itemBottomRounded]}>
          <View style={styles.itemLeft}>
            <Icon name="heart-circle-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Employee ID : </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.textColor }]}>{employeeID ? employeeID : 'Null'}</Text>
        </View>

      </View>

      {/* Utilities */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionHeaderText, { color: theme.textColor }]}>Utilities</Text>

        {/* Utility Items */}
        <TouchableOpacity style={[styles.itemContainer, styles.itemTopRounded]}>
          <View style={styles.itemLeft}>
            <Icon1 name="person-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Account Settings</Text>
          </View>
          <Icon1 name="chevron-forward-outline" color={theme.iconProfile} size={wp('7%')} style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer}>
          <View style={styles.itemLeft}>
            <Icon1 name="notifications-off-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Notification</Text>
          </View>
          <Icon1 name="chevron-forward-outline" color={theme.iconProfile} size={wp('7%')} style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemContainer} onPress={toggleColorScheme}>
          <View style={styles.itemLeft}>
            <Icon1 name="moon-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Dark Mode</Text>
          </View>
          <Switch value={colorScheme === 'dark'} onValueChange={toggleColorScheme}
            trackColor={{ false: '#767577', true: '#FAFAFA' }} thumbColor={colorScheme === 'dark' ? '#00C853' : '#f4f3f4'}
            style={styles.switch} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.itemContainer, styles.itemBottomRounded]} onPress={logout}>
          <View style={styles.itemLeft}>
            <Icon1 name="exit-outline" color={theme.iconProfile} size={wp('6%')} />
            <Text style={[styles.itemText, { color: theme.textColor }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>



    </ScrollView>
  );
};

export default HomeProfileScreen;
