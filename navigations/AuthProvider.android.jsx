import React, { createContext, useState, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { firebase } from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password)

                        setUser(auth().currentUser);
                    }
                    catch (e) {
                        console.log(e);
                        if (e.code === 'auth/invalid-credential') {
                            Alert.alert('Login Error', 'Incorrect password.');
                        } else if (e.code === 'auth/user-not-found') {
                            Alert.alert('Login Error', 'No user found with this email.');
                        } else {
                            Alert.alert('Login Error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                        }
                    }
                },
                googleLogin: async () => {
                    try {
                        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }); // เช็คว่ามี Google Play Services

                        const userInfo = await GoogleSignin.signIn(); // ดึงข้อมูลผู้ใช้
                        //console.log("User Info: ", userInfo); // ตรวจสอบข้อมูลผู้ใช้
                        const idToken = userInfo.data.idToken; // ดึง idToken จาก userInfo
                        //console.log("idToken: ", idToken); // ตรวจสอบค่า idToken
                        if (!idToken) {
                            console.error('idToken is undefined'); // ถ้าไม่มี idToken ให้แสดง log error
                            return;
                        }
                        // สร้าง credential สำหรับ Firebase จาก Google idToken
                        const credential = auth.GoogleAuthProvider.credential(idToken);
                        const userCredential = await auth().signInWithCredential(credential); // ลงชื่อเข้าใช้ Firebase
                        const { email, uid } = userCredential.user; // ดึงข้อมูล email และ uid ของผู้ใช้
                        // ตรวจสอบอีเมลและกำหนดบทบาท (role)
                        // ตรวจสอบบทบาทจาก Firestore คอลเลคชัน "roles"
                        const roleDocRef = firebase.firestore().collection('roles').doc(email); // ใช้อีเมลเป็นไอดีในคอลเลคชัน
                        const roleDoc = await roleDocRef.get();

                        let role = 'user'; // บทบาทเริ่มต้นเป็น 'user'

                        if (roleDoc.exists) {
                            const roleData = roleDoc.data();
                            if (roleData.role === 'admin') {
                                role = 'admin'; // ถ้าเจออีเมลในฐานข้อมูล role เป็น admin
                            }
                        }

                        console.log(`User signed in as ${role}`); // แสดง log บทบาทที่ตรวจสอบได้

                        // บันทึกบทบาทของผู้ใช้ใน Firestore คอลเลคชัน "users"
                        const userDocRef = firebase.firestore().collection('users').doc(uid);
                        await userDocRef.set({
                            email: email,
                            role: role,  // บทบาทจากการตรวจสอบ
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        });

                        // ตรวจสอบการบันทึกบทบาทใน Firestore
                        const savedUserDoc = await userDocRef.get();
                        console.log('Saved role in Firestore:', savedUserDoc.data().role);

                        // ตั้งค่า user ในแอป
                        setUser(auth().currentUser);


                        console.log(`User signed in as ${role}`);
                    }
                    catch (error) {
                        console.error('Error during Google Sign-In: ', error); // ตรวจสอบ error ที่เกิดขึ้น
                    }
                },
                fbLogin: async () => {
                    try {
                        // Attempt login with permissions
                        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                        if (result.isCancelled) {
                            throw 'User cancelled the login process';
                        }

                        // Once signed in, get the users AccessToken
                        const data = await AccessToken.getCurrentAccessToken();

                        if (!data) {
                            throw 'Something went wrong obtaining access token';
                        }

                        console.log('Access Token:', data.accessToken); // ตรวจสอบค่าที่ได้

                        // Create a Firebase credential with the AccessToken
                        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                        // Sign-in the user with the credential
                        const userCredential = await auth().signInWithCredential(facebookCredential);

                        const { email, uid } = userCredential.user; // ดึงข้อมูล email และ uid ของผู้ใช้

                        // ตรวจสอบบทบาทจาก Firestore คอลเลคชั่น "roles"
                        const roleDocRef = firebase.firestore().collection('roles').doc(email); // ใช้อีเมลเป็นไอดีในคอลเลคชัน
                        const roleDoc = await roleDocRef.get();

                        let role = 'user'; // บทบาทเริ่มต้นเป็น 'user'

                        if (roleDoc.exists) {
                            const roleData = roleDoc.data();
                            if (roleData.role === 'admin') {
                                role = 'admin'; // ถ้าเจออีเมลในฐานข้อมูล role เป็น admin
                            }
                        }

                        console.log(`User signed in as ${role}`); // แสดง log บทบาทที่ตรวจสอบได้

                        // บันทึกบทบาทของผู้ใช้ใน Firestore คอลเลคชัน "users"
                        const userDocRef = firebase.firestore().collection('users').doc(uid);

                        await userDocRef.set({
                            email: email,
                            role: role,  // บทบาทจากการตรวจสอบ
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        });

                        // ตรวจสอบการบันทึกบทบาทใน Firestore
                        const savedUserDoc = await userDocRef.get();
                        console.log('Saved role in Firestore:', savedUserDoc.data().role);

                        // ตั้งค่า user ในแอป
                        setUser(auth().currentUser);
                    } catch (e) {
                        console.log('Error during Facebook login:', e);
                    }
                },

                register: async (email, password) => {
                    // ตรวจสอบค่าว่างและรูปแบบของอีเมลก่อนสมัครสมาชิก
                    if (!email || !password) {
                        Alert.alert('Error', 'Email and password cannot be empty.');
                        return;
                    }
                    // ตรวจสอบรูปแบบอีเมลตามมาตรฐานทั่วไป
                    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailPattern.test(email)) {
                        Alert.alert('Error', 'Please enter a valid email address.');
                        return;
                    }
                    // ตรวจสอบว่าอีเมลมีอยู่ในฐานข้อมูลหรือไม่
                    const signInMethods = await auth().fetchSignInMethodsForEmail(email);
                    if (signInMethods.length > 0) {
                        Alert.alert('Error', 'This email address is already registered.');
                        return;
                    }

                    try {
                        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                        const uid = userCredential.user.uid; // ดึง UID ของผู้ใช้ที่ลงทะเบียน
                        let role = 'user'; // ตั้งค่าเริ่มต้นเป็น user

                        // ตรวจสอบบทบาทจาก Firestore คอลเลคชัน "roles"
                        const roleDocRef = firebase.firestore().collection('roles').doc(email); // ใช้อีเมลเป็นไอดีในคอลเลคชัน
                        const roleDoc = await roleDocRef.get();

                        if (roleDoc.exists) {
                            const roleData = roleDoc.data();
                            if (roleData.role === 'admin') {
                                role = 'admin'; // ถ้าเจออีเมลในฐานข้อมูล role ให้กำหนดเป็น admin
                            }
                        }


                        // บันทึกข้อมูลบทบาทลงในคอลเลคชัน "users"
                        const userDocRef = firebase.firestore().collection('users').doc(uid);
                        await userDocRef.set({
                            email: email,
                            role: role,  // บทบาทที่ถูกตรวจสอบ
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        });


                        Alert.alert('Success', 'Registration successful!', [
                            { text: 'OK', } // กลับไปยังหน้าล็อกอิน
                        ]);
                        await auth().signOut();
                    } catch (e) {
                        console.log(e);
                        if (e.code === 'auth/email-already-in-use') {
                            Alert.alert('Error', 'This email address is already in use.');
                        } else if (e.code === 'auth/invalid-email') {
                            Alert.alert('Error', 'The email address is badly formatted.');
                        } else if (e.code === 'auth/weak-password') {
                            Alert.alert('Error', 'The password is too weak.');
                        } else {
                            Alert.alert('Error', 'Something went wrong. Please try again.');
                        }
                    }
                },
                resetPassword: async (email) => {
                    if (!email) {
                        Alert.alert('Error', 'Please enter your email to reset the password.');
                        return;
                    }

                    const emailTrimmed = email.trim(); // ตัดช่องว่างออกจากอีเมล

                    // Log the email being checked
                    console.log('Email to reset password:', emailTrimmed);

                    try {
                        const signInMethods = await auth().fetchSignInMethodsForEmail(emailTrimmed);
                        console.log('Sign-in methods:', signInMethods);

                        if (signInMethods.length > 0) {
                            Alert.alert('Error', 'No user found with this email.');
                            return;
                        }

                        await auth().sendPasswordResetEmail(emailTrimmed);
                        Alert.alert('Success', 'Password reset email sent. Please check your email.');
                    } catch (e) {
                        console.log('Error fetching sign-in methods:', e);
                        if (e.code === 'auth/invalid-email') {
                            Alert.alert('Error', 'The email address is badly formatted.');
                        } else {
                            Alert.alert('Error', 'Something went wrong. Please try again.');
                        }
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider >
    );
}
