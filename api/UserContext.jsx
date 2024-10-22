import React, { createContext, useState, useEffect } from 'react';
import { firebase } from '@react-native-firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from '../navigations/AuthProvider'; // Import AuthProvider ของคุณ

// สร้าง Context
export const UserContext = createContext();

// สร้าง Provider ที่จะห่อหุ้ม component ต่าง ๆ เพื่อให้เข้าถึงข้อมูลผู้ใช้
export const UserProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // ใช้ข้อมูลจาก AuthContext สำหรับข้อมูลผู้ใช้ที่ล็อกอิน
    const [profileImage, setProfileImage] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [company, setCompany] = useState(null);
    const [department, setDepartment] = useState(null);
    const [description, setDescription] = useState(null);
    const [role, setRole] = useState('user'); // ตั้งค่า role เป็น user โดยดีฟอลต์
    const [loading, setLoading] = useState(true);

    // ฟังก์ชันดึงข้อมูลผู้ใช้จาก Firestore
    const fetchUserProfile = async () => {
        try {
            if (user) {
                const userDocRef = firebase.firestore().collection('users').doc(user.email);
                const doc = await userDocRef.get();
                if (doc.exists) {
                    const userData = doc.data();
                    // อัปเดต state ด้วยข้อมูลผู้ใช้จาก Firestore
                    setProfileImage(userData.profileImage || 'https://defaultimage.com/default.jpg');
                    setDisplayName(userData.name || user.displayName);
                    setEmail(userData.email || user.email);
                    setPhone(userData.phone || null);
                    setCompany(userData.company || null);
                    setDepartment(userData.department || null);
                    setDescription(userData.description || 'Nick Name');
                    setRole(userData.role || 'user'); // ถ้าไม่มี role ในฐานข้อมูล จะถือว่าเป็น user
                    setLoading(false);
                }
            }
        } catch (error) {
            console.log('Error fetching user profile:', error);
        }
    };

    // เรียกใช้เมื่อ component ถูก mount (หรือเมื่อ user เปลี่ยนแปลง)
    useEffect(() => {
        fetchUserProfile();
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
                description,
                role,
                loading,
                setProfileImage,
                setDisplayName,
                setEmail,
                setPhone,
                setCompany,
                setDepartment,
                setDescription,
                setRole,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
