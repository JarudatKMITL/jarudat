import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomDrawer = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <ImageBackground
          source={require('../assets/images/drawer-bg1.jpg')}
          style={styles.imageBackground}>
          <Image
            source={require('../assets/images/user-profile.jpg')}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Jarudat chaikuad</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.userRole}>admin : IT</Text>
          </View>
        </ImageBackground>

        <View style={styles.drawerList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
          <View style={styles.footerButtonContent}>
            <Ionicons name="share-social-outline" size={22} />
            <Text style={styles.footerButtonText}>Tell a Friend</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
          <View style={styles.footerButtonContent}>
            <Ionicons name="exit-outline" size={22} />
            <Text style={styles.footerButtonText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    backgroundColor: '#1f212c',
  },
  imageBackground: {
    padding: wp('5%'),
  },
  profileImage: {
    height: hp('10%'),
    width: hp('10%'),
    borderRadius: hp('5%'),
    marginBottom: hp('1.5%'),
  },
  userName: {
    color: 'white',
    fontSize: wp('5%'),
    marginBottom: hp('0.5%'),
    fontWeight: '500',
  },
  roleContainer: {
    flexDirection: 'row',
  },
  userRole: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: '400',
  },
  drawerList: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: hp('1%'),
  },
  footerContainer: {
    padding: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    paddingVertical: hp('1.5%'),
  },
  footerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: wp('4%'),
    fontFamily: 'Roboto-Medium',
    marginLeft: wp('1.5%'),
  },
});
