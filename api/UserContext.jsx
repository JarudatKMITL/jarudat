import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../navigations/AuthProvider';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [profileImage, setProfileImage] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [company, setCompany] = useState(null);
    const [department, setDepartment] = useState(null);
    const [nickName, setNickName] = useState(null);
    const [employeeID, setEmployeeID] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);

    // โหลดข้อมูลจากแคชเมื่อแอปเริ่มต้น
    const loadCachedUserData = async () => {
        try {
            const cachedUserData = await AsyncStorage.getItem('userProfile');
            if (cachedUserData) {
                const parsedData = JSON.parse(cachedUserData);
                setProfileImage(parsedData.profileImage);
                setDisplayName(parsedData.displayName);
                setEmail(parsedData.email);
                setPhone(parsedData.phone);
                setCompany(parsedData.company);
                setDepartment(parsedData.department);
                setNickName(parsedData.nickName);
                setRole(parsedData.role);
                setEmployeeID(parsedData.employeeID || null);
            }
        } catch (error) {
            console.log('Error loading cached user data:', error);
        } finally {
            setLoading(false); // ปิด loading ไม่ว่าจะสำเร็จหรือไม่
        }
    };

    // เก็บข้อมูลในแคชเมื่อมีการอัปเดตข้อมูลใหม่
    const cacheUserData = async (data) => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(data));
        } catch (error) {
            console.log('Error caching user data:', error);
        }
    };

    // ฟังก์ชันดึงข้อมูลผู้ใช้จาก Firestore
    const fetchUserProfile = async () => {
        if (!user) return;

        const userDocRef = firebase.firestore().collection('users').doc(user.email);
        const doc = await userDocRef.get();
        
        if (doc.exists) {
            const userData = doc.data();
            setProfileImage(userData.profileImage);
            setDisplayName(userData.displayName);
            setEmail(userData.email);
            setPhone(userData.phone || null);
            setCompany(userData.company || null);
            setDepartment(userData.department || null);
            setNickName(userData.nickName || null);
            setRole(userData.role || 'user');
            setEmployeeID(userData.employeeID || null);
            
            // เก็บข้อมูลใหม่ลงในแคช
            cacheUserData(userData);
        }
    };

    // ฟังก์ชันรีเฟรชข้อมูลผู้ใช้
    const refreshUserProfile = async () => {
        setLoading(true); // ตั้งค่า loading ให้เป็น true
        await fetchUserProfile(); // ดึงข้อมูลใหม่จาก Firestore
        setLoading(false); // ตั้งค่า loading กลับเป็น false
    };

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        loadCachedUserData(); // โหลดข้อมูลจากแคชตอนเริ่มต้น

        const userDocRef = firebase.firestore().collection('users').doc(user.email);
        
        const unsubscribe = userDocRef.onSnapshot(async (doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const cachedUserData = await AsyncStorage.getItem('userProfile');
                const parsedCachedData = cachedUserData ? JSON.parse(cachedUserData) : {};

                // ตรวจสอบว่าข้อมูลใหม่ตรงกับข้อมูลในแคชหรือไม่
                if (JSON.stringify(userData) !== JSON.stringify(parsedCachedData)) {
                    setProfileImage(userData.profileImage);
                    setDisplayName(userData.displayName);
                    setEmail(userData.email);
                    setPhone(userData.phone || null);
                    setCompany(userData.company || null);
                    setDepartment(userData.department || null);
                    setNickName(userData.nickName || null);
                    setRole(userData.role || 'user');
                    setEmployeeID(userData.employeeID || null);
                    
                    cacheUserData(userData); // เก็บข้อมูลใหม่ลงในแคช
                }
            }
            setLoading(false); // ปิด loading เมื่อโหลดข้อมูลเสร็จ
        }, (error) => {
            console.log('Error fetching user profile:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                profileImage,
                displayName,
                email,
                phone,
                company,
                department,
                nickName,
                role,
                loading,
                employeeID,
                refreshUserProfile, // เพิ่มฟังก์ชันรีเฟรชให้ context
                setProfileImage,
                setDisplayName,  // ตรวจสอบให้แน่ใจว่ามีฟังก์ชันนี้
                setPhone,         // ตรวจสอบให้แน่ใจว่ามีฟังก์ชันนี้
                setCompany,       // ตรวจสอบให้แน่ใจว่ามีฟังก์ชันนี้
                setDepartment,    // ตรวจสอบให้แน่ใจว่ามีฟังก์ชันนี้
                setNickName,      // ตรวจสอบให้แน่ใจว่ามีฟังก์ชันน
                setEmployeeID,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
