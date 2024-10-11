import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from "../navigations/AuthProvider";

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const { resetPassword } = useContext(AuthContext);

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Reset Password</Text>
            <TextInput
                style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity
                onPress={() => resetPassword(email)}
                style={{ backgroundColor: 'blue', padding: 15, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Send Reset Email</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ResetPasswordScreen;