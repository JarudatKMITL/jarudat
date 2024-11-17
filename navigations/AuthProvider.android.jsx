import React, { createContext, useState, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { firebase } from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            console.log('Auth State Changed. Current User:', user); // ตรวจสอบการเปลี่ยนแปลง State
            setUser(user);
        });

        return subscriber; // Unsubscribe เมื่อ component ถูก unmount
    }, []);

    console.log('AuthProvider User:', user); // ตรวจสอบ User ในทุกครั้งที่ AuthProvider render


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        // เก็บผลลัพธ์จากการล็อกอิน
                        const userCredential = await auth().signInWithEmailAndPassword(email, password);
                        const user = userCredential.user; // ดึงข้อมูลผู้ใช้

                        // ตรวจสอบสถานะ emailVerified
                        if (!user.emailVerified) {
                            await auth().signOut(); // เซ็นออกทันทีหากยังไม่ได้ยืนยันอีเมล
                            Alert.alert(
                                'Email Verification Required',
                                'Please verify your email before logging in. Check your email inbox or spam folder.'
                            );
                            return;
                        }

                        // ตั้งค่าผู้ใช้เมื่อเข้าสู่ระบบสำเร็จและยืนยันอีเมลแล้ว
                        setUser(user);
                        //Alert.alert('Success', 'Login successful!');
                    } catch (e) {
                        console.log(e);

                        // จัดการข้อผิดพลาดการล็อกอิน
                        if (e.code === 'auth/wrong-password') {
                            Alert.alert('Login Error', 'Incorrect password.');
                        } else if (e.code === 'auth/user-not-found') {
                            Alert.alert('Login Error', 'No user found with this email.');
                        } else if (e.code === 'auth/invalid-email') {
                            Alert.alert('Login Error', 'Invalid email address.');
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
                        const { email, uid, displayName, photoURL } = userCredential.user; // ดึงข้อมูล email และ uid ของผู้ใช้



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

                        //console.log(`User signed in as ${role}`); // แสดง log บทบาทที่ตรวจสอบได้



                        // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน Firestore คอลเลคชัน "users" หรือไม่
                        const userDocRef = firebase.firestore().collection('users').doc(email);
                        const userDoc = await userDocRef.get();

                        if (!userDoc.exists) {
                            // ถ้าไม่มีเอกสารใน Firestore ให้สร้างใหม่
                            console.log("Creating new user document...");
                            await userDocRef.set({
                                email: email,
                                role: role,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                displayName: displayName || "No Name", // ตั้งค่าเริ่มต้นหาก displayName เป็น null
                                profileImage: photoURL || "default_image_url", // ตั้งค่าเริ่มต้นหาก photoURL เป็น null
                                role_status: "pending", // ตั้งค่า role_status เป็นค่าเริ่มต้น
                            });
                        } else {
                            // ถ้ามีเอกสารอยู่แล้ว อัปเดตเฉพาะฟิลด์ที่ไม่มีอยู่
                            console.log("Updating existing user document...");
                            const userData = userDoc.data();
                            const updateData = {};

                            // อัปเดต displayName เฉพาะกรณีที่ยังไม่มีค่าในเอกสาร
                            if (!userData.displayName && displayName) {
                                updateData.displayName = displayName;
                            }

                            // อัปเดต profileImage เฉพาะกรณีที่ยังไม่มีค่าในเอกสาร
                            if (!userData.profileImage && photoURL) {
                                updateData.profileImage = photoURL;
                            }

                            // อัปเดต role_status เฉพาะกรณีที่ไม่มีในเอกสาร
                            if (!userData.role_status) {
                                updateData.role_status = "pending"; // ตั้งค่า role_status ถ้ายังไม่มี
                            }

                            // อัปเดต role และ email
                            updateData.email = email;
                            updateData.role = role;

                            // ถ้ามีฟิลด์ที่ต้องอัปเดตให้ทำการอัปเดต
                            if (Object.keys(updateData).length > 0) {
                                await userDocRef.set(updateData, { merge: true }); // ใช้ merge: true เพื่อป้องกันการเขียนทับข้อมูลเดิม
                                console.log("Document updated with:", updateData);
                            } else {
                                console.log("No fields to update.");
                            }
                        }


                        // ตรวจสอบการบันทึกบทบาทใน Firestore
                        const savedUserDoc = await userDocRef.get();
                        //console.log('Saved role in Firestore:', savedUserDoc.data().role);

                        // ตั้งค่า user ในแอป
                        setUser(auth().currentUser);


                        //console.log(`User signed in as ${role}`);
                    }
                    catch (error) {
                        console.error('Error during Google Sign-In: ', error); // ตรวจสอบ error ที่เกิดขึ้น
                    }
                },
                fbLogin: async () => {
                    try {
                        // ล้างข้อมูลการเข้าสู่ระบบ
                        await LoginManager.logOut();

                        // Attempt login with permissions
                        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                        if (result.isCancelled) {
                            throw 'User cancelled the login process';
                        }

                        // Once signed in, get the users AccessToken
                        const data = await AccessToken.getCurrentAccessToken();

                        if (!data || !data.accessToken) {
                            throw 'Something went wrong obtaining access token';
                        }

                        console.log('Access Token:', data.accessToken); // ตรวจสอบค่าที่ได้

                        // Create a Firebase credential with the AccessToken
                        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                        // Sign-in the user with the credential
                        const userCredential = await auth().signInWithCredential(facebookCredential);

                        const { email, uid } = userCredential.user; // ดึงข้อมูล email และ uid ของผู้ใช้
                        const facebookProfile = userCredential.additionalUserInfo.profile;

                        // ตรวจสอบบทบาทจาก Firestore คอลเลคชั่น "roles"
                        const roleDocRef = firebase.firestore().collection('roles').doc(email);
                        const roleDoc = await roleDocRef.get();

                        let role = 'user'; // บทบาทเริ่มต้นเป็น 'user'

                        if (roleDoc.exists) {
                            const roleData = roleDoc.data();
                            if (roleData.role === 'admin') {
                                role = 'admin'; // ถ้าเจออีเมลในฐานข้อมูล role เป็น admin
                            }
                        }

                        console.log(`User signed in as ${role}`); // แสดง log บทบาทที่ตรวจสอบได้

                        const displayName = facebookProfile.name;
                        const profileImage = facebookProfile.picture.data.url;

                        // บันทึกบทบาทของผู้ใช้ใน Firestore คอลเลคชัน "users"
                        const userDocRef = firebase.firestore().collection('users').doc(email);

                        // ดึงข้อมูลเอกสารผู้ใช้จาก Firestore ก่อนตรวจสอบว่ามีเอกสารอยู่หรือไม่
                        const userDoc = await userDocRef.get();

                        // ถ้ายังไม่มีข้อมูลเอกสารของผู้ใช้มาก่อน จะเพิ่มข้อมูลใหม่
                        if (!userDoc.exists) {
                            await userDocRef.set({
                                email: email,
                                role: role,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                displayName: displayName,
                                profileImage: profileImage,
                                role_status: "pending",
                            });
                        } else {
                            // ถ้ามีเอกสารอยู่แล้ว เพิ่มเฉพาะฟิลด์ที่มีอยู่เท่านั้น
                            await userDocRef.set({
                                email: email,
                                role: role,
                            }, { merge: true });
                        }

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
                    if (!email || !password) {
                        Alert.alert('Error', 'Email and password cannot be empty.');
                        return;
                    }

                    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailPattern.test(email)) {
                        Alert.alert('Error', 'Please enter a valid email address.');
                        return;
                    }

                    try {
                        console.log('Checking if email is already registered...');
                        const signInMethods = await auth().fetchSignInMethodsForEmail(email);
                        if (signInMethods.length > 0) {
                            Alert.alert('Error', 'This email address is already registered.');
                            return;
                        }
                    } catch (e) {
                        console.log('Error fetching sign-in methods:', e);
                        if (e.code === 'auth/network-request-failed') {
                            Alert.alert('Error', 'Network error. Please check your connection.');
                        } else {
                            Alert.alert('Error', 'Unable to verify email. Please try again later.');
                        }
                        return;
                    }

                    let emailVerificationSent = false;

                    try {
                        console.log('Creating user...');
                        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                        const user = userCredential.user;

                        //console.log('Saving user data to Firestore...');
                        // ตรวจสอบบทบาทจาก Firestore คอลเลคชั่น "roles"
                        const roleDocRef = firebase.firestore().collection('roles').doc(email);
                        const roleDoc = await roleDocRef.get();
                        let role = 'user'; // บทบาทเริ่มต้นเป็น 'user'

                        if (roleDoc.exists) {
                            const roleData = roleDoc.data();
                            if (roleData.role === 'admin') {
                                role = 'admin'; // ถ้าเจออีเมลในฐานข้อมูล role เป็น admin
                            }
                        }
                        const userDocRef = firebase.firestore().collection('users').doc(user.email);
                        await userDocRef.set({
                            email: email,
                            role: role,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            profileImage: 'https://example.com/default-profile.jpg',
                            displayName: 'Untitled',
                            role_status: "pending",
                            emailVerified: false,
                        });

                        console.log('Sending email verification...');
                        if (user) {
                            try {
                                await user.sendEmailVerification();
                                emailVerificationSent = true;

                            } catch (error) {
                                console.log('Error sending email verification:', error);
                                Alert.alert('Error', 'Failed to send verification email.');
                            }
                        }
                    } catch (e) {
                        console.log('Error during registration process:', e);
                        if (!emailVerificationSent) {
                            Alert.alert('Error', 'Failed to send verification email.');
                        }

                        if (!e || !e.code) {
                            console.log('No specific error code found. Skipping error alert.');
                            return;
                        }

                        if (e.code === 'auth/email-already-in-use') {
                            Alert.alert('Error', 'This email address is already in use.');
                        } else if (e.code === 'auth/invalid-email') {
                            Alert.alert('Error', 'The email address is badly formatted.');
                        } else if (e.code === 'auth/weak-password') {
                            Alert.alert('Error', 'The password is too weak.');
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
                    //console.log('Email to reset password:', emailTrimmed);

                    try {
                        const signInMethods = await auth().fetchSignInMethodsForEmail(emailTrimmed);
                        // console.log('Sign-in methods:', signInMethods);

                        if (signInMethods.length > 0) {
                            Alert.alert('Error', 'No user found with this email.');
                            return;
                        }

                        await auth().sendPasswordResetEmail(emailTrimmed);
                        //Alert.alert('Success', 'Password reset email sent. Please check your email.');
                    } catch (e) {
                        console.log('Error fetching sign-in methods:', e);
                        if (e.code === 'auth/invalid-email') {
                            Alert.alert('Error', 'The email address is badly formatted.');
                        } else {
                            //Alert.alert('Error', 'Something went wrong. Please try again.');
                        }
                    }
                },

                logout: async () => {
                    try {
                        // ออกจากระบบ Firebase ก่อน
                        await auth().signOut();
                        console.log("User logged out from Firebase");
                        // ล้างข้อมูล Local Storage เพื่อรีเซ็ตสถานะของแอป
                        await AsyncStorage.clear(); // ล้างข้อมูลที่จัดเก็บใน AsyncStorage
                        console.log("Local Storage cleared");
                        // Facebook Logout ก่อน Google Logout
                        const facebookToken = await AccessToken.getCurrentAccessToken();
                        if (facebookToken) {
                            await LoginManager.logOut(); // Facebook logout
                            console.log("Logged out of Facebook successfully");
                        } else {
                            console.log("No Facebook login session found");
                        }

                        // Google Logout หลังจาก Facebook Logout
                        await GoogleSignin.revokeAccess(); // รีเซ็ตสิทธิ์การเข้าถึง Google
                        await GoogleSignin.signOut(); // Google logout
                        console.log("Google account revoked and signed out");

                    } catch (e) {
                        console.log("Error during logout process:", e);
                    }
                }
            }}
        >
            {children}
        </AuthContext.Provider >
    );
}
