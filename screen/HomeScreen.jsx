import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet ,Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from "../navigations/AuthProvider";


const HomeScreen = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);
  console.log('user',user);
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>

      {user ? (
        <>
          <Text style={{ fontSize: 24 }}>Welcome, {user.displayName || "User"}!</Text>
          <Text>Email: {user.email}</Text>
          <Text>User ID: {user.uid}</Text>
          <Image source={{ uri: user.photoURL }} style={{ width: 200, height: 200 }} />
          <Text>Email Verified: {user.emailVerified ? "Yes" : "No"}</Text>
          
        </>
      ) : (
        <Text>Please log in.</Text>
      )}



      <TouchableOpacity onPress={(logout)}>
        <Text>Loginout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeScreen

