import React, { useState, useContext } from 'react';
import { View, StatusBar, TextInput, Text, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, ActivityIndicator } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { useTheme } from '../components/ThemeContext';
import { AuthContext } from "../navigations/AuthProvider";
import { UserContext } from '../api/UserContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';

const CreateTicketScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { profileImage, displayName, email, phone, company, department, role, description } = useContext(UserContext);
  const { theme, colorScheme, toggleColorScheme } = useTheme();
  const [errorFields, setErrorFields] = useState({ title: false, descriptions: false, category: false });
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // สถานะ Modal
  const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 300 }); // เก็บข้อมูลขนาดภาพเริ่มต้น
  // สถานะสำหรับข้อมูลฟอร์ม
  const [title, setTitle] = useState('');
  const [descriptions, setDescriptions] = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false); // สถานะการโหลดเมื่อบันทึก
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [tags, settags] = useState('');
  const [followUpDetails, setFollowUpDetails] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');


  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory); // ตั้งค่า category ที่เลือก
  };
  const handleCreateTicket = async () => {
    let errors = {
      title: !title,
      descriptions: !descriptions,
      category: !category
    };
    setErrorFields(errors);

    // ตรวจสอบว่ามีฟิลด์ไหนที่ไม่ถูกกรอกข้อมูล
    if (!title || !descriptions || !category) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true); // เริ่มการแสดงการหมุน

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนต้องการให้มีสองหลัก
      const day = String(now.getDate()).padStart(2, '0'); // วันที่ต้องการให้มีสองหลัก

      // ดึงจำนวนงานที่มีทั้งหมดเพื่อนับลำดับ
      const ticketRef = firebase.firestore().collection('tickets');
      const querySnapshot = await ticketRef.get();

      // นับจำนวนงานทั้งหมดแล้วเพิ่ม 1 (เพื่อให้เลขลำดับไม่ซ้ำกัน)
      const ticketCount = querySnapshot.size + 1;
      const ticketNumber = String(ticketCount).padStart(3, '0'); // เริ่มที่ 000 แล้วบวกขึ้นไป

      // สร้าง Document ID ตามรูปแบบที่ต้องการ: YYYYMMDD000
      const ticketId = `${year}${month}${day}${ticketNumber}`;

      // ตรวจสอบว่ามีเอกสารที่ใช้ ticketId นี้หรือไม่
      const existingDoc = await ticketRef.doc(ticketId).get();
      if (existingDoc.exists) {
        Alert.alert('Error', 'A ticket with this ID already exists. Please try again.');
        setLoading(false);
        return;
      }

      // บันทึกข้อมูลของ ticket ใน Firestore โดยใช้ ticketId เป็น Document ID
      await ticketRef.doc(ticketId).set({
        displayName,
        phone,
        company,
        department,
        role,
        description,
        ticketCount,
        profileImage,

        title,
        descriptions,
        priority,
        category,
        location,
        userEmail: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'open', // เริ่มต้นด้วยสถานะ "open"
        dueDate: dueDate || null, // วันที่กำหนดเสร็จ
        estimatedTime: estimatedTime || null, // เวลาโดยประมาณในการแก้ไขปัญหา
        attachments: selectedImage, // เอกสารหรือรูปภาพที่แนบมา
        tags: tags || [], // แท็กหรือป้ายกำกับ
        followUpDetails: followUpDetails || '', // รายละเอียดการติดตาม
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(), // วันที่อัปเดตล่าสุด
        resolutionNotes: '', // บันทึกการแก้ปัญหาหลังจากเสร็จสิ้น
      });

      Alert.alert('Success', 'Your ticket has been created successfully!');
      navigation.goBack(); // กลับไปยังหน้าหลัก
    } catch (error) {
      console.log('Error creating ticket:', error);
      Alert.alert('Error', 'Failed to create ticket. Please try again later.');
    } finally {
      setLoading(false); // ปิดการแสดงการหมุนเมื่อบันทึกเสร็จ
    }
  };


  // ฟังก์ชันเลือกภาพจากแกลเลอรี่
  const selectImageFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 300,
    })
      .then(image => {
        setSelectedImage(image.path); // แสดงรูปที่เลือก
        setImageDimensions({ width: image.width, height: image.height }); // เก็บขนาดภาพ
        setModalVisible(false); // ปิด Modal
      })
      .catch(error => console.log('Error picking image: ', error));
  };

  // ฟังก์ชันถ่ายรูปจากกล้อง
  const takePhotoWithCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 300,
      height: 300,
    })
      .then(image => {
        setSelectedImage(image.path); // แสดงรูปที่ถ่าย
        setImageDimensions({ width: image.width, height: image.height }); // เก็บขนาดภาพ
        setModalVisible(false); // ปิด Modal
      })
      .catch(error => console.log('Error capturing image: ', error));
  };

  // ฟังก์ชันสำหรับลบรูปภาพ
  const removeImage = () => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove your image?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => setSelectedImage(null), // ลบรูปภาพ
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: theme.backgroundColor }}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} // or "dark-content"
        backgroundColor={theme.backgroundColor} // Set this to match your header
      />

      <View className="flex flex-col space-y-4">
        <Text
          className="mt-5 mb-5 text-xl font-semibold font- leading-relaxed text-center"
          style={{ color: theme.textColor }}
        >
          Please provide details of your request{"\n"} and select the service type.
        </Text>




        <View className="my-4">
          {/* กรอบคำบรรยาย */}
          <View className="relative ">
            {/* ข้อความบรรยายด้านบน input */}
            <Text
              className="absolute left-3 -top-3  px-1 text-blue-500 z-10 font-Light font-bold text-[18px]"
              style={{ zIndex: 10, backgroundColor: theme.backgroundColor, color: theme.textColor }}
            >
              Subject
            </Text>

            {/* กรอบ input */}
            <TextInput
              className={'border rounded-lg p-4 text-lg font-Light '}
              style={{
                borderColor: errorFields.title ? '#B00020' : theme.borderColor,  // ถ้าฟิลด์ title มีข้อผิดพลาด เปลี่ยนเป็นสีแดง
                borderWidth: 4,  // ความกว้างของขอบ
                color: theme.textColor
              }}
              value={title}
              onChangeText={setTitle}
              placeholder="Please enter the subject."
              placeholderTextColor={errorFields.title ? '#B00020' : '#AEB5BB'} // เปลี่ยนสี placeholder ถ้ามีข้อผิดพลาด
            />
          </View>
        </View>

        {/* Description */}
        <View className="my-4">
          {/* กรอบคำบรรยาย */}
          <View className="relative ">
            <Text
              className="absolute left-3 -top-3  px-1 text-blue-500 z-10  font-Light font-bold text-[18px]"
              style={{ zIndex: 10, backgroundColor: theme.backgroundColor, color: theme.textColor }}
            >
              Description
            </Text>
            <TextInput
              className={'border rounded-lg p-4 text-lg h-28'}
              style={{
                borderColor: errorFields.title ? '#B00020' : theme.borderColor,  // ถ้าฟิลด์ title มีข้อผิดพลาด เปลี่ยนเป็นสีแดง
                borderWidth: 4,  // ความกว้างของขอบ
                color: theme.textColor
              }}
              placeholder="Please enter the"
              placeholderTextColor={errorFields.title ? '#B00020' : '#AEB5BB'} // เปลี่ยนสี placeholder ถ้ามีข้อผิดพลาด
              value={descriptions}
              onChangeText={setDescriptions}
              multiline={true}

            />
          </View>
        </View>

        {/* Location */}

        <View className="my-4">
          {/* กรอบคำบรรยาย */}
          <View className="relative ">
            {/* ข้อความบรรยายด้านบน input */}
            <Text
              className="absolute left-3 -top-3  px-1 text-blue-500 z-10 font-Light font-bold text-[18px]"
              style={{ zIndex: 10, backgroundColor: theme.backgroundColor, color: theme.textColor }}
            >
              Location
            </Text>

            {/* กรอบ input */}
            <TextInput
              className={'border rounded-lg p-4 text-lg font-Light '}
              style={{
                borderColor: errorFields.title ? '#B00020' : theme.borderColor,  // ถ้าฟิลด์ title มีข้อผิดพลาด เปลี่ยนเป็นสีแดง
                borderWidth: 4,  // ความกว้างของขอบ
                color: theme.textColor
              }}
              value={location}
              onChangeText={setLocation}
              placeholder="Please enter the location."
              placeholderTextColor={errorFields.title ? '#B00020' : '#AEB5BB'} // เปลี่ยนสี placeholder ถ้ามีข้อผิดพลาด
            />
          </View>
        </View>

        {/* Priority */}
        <Text className="text-lg  font-Light font-bold text-[18px]" style={{ color: theme.textColor }}>Priority</Text>
        <View className="flex flex-row space-x-4">
          <TouchableOpacity
            onPress={() => setPriority('low')}
            className={`flex-1 p-4 rounded-lg items-center justify-center ${priority === 'low' ? 'bg-green-500' : 'bg-gray-300'}`}>
            <Text style={{ color: theme.textColor }} className="font-bold text-[18px]">Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority('medium')}
            className={`flex-1 p-4 rounded-lg items-center justify-center ${priority === 'medium' ? 'bg-orange-500' : 'bg-gray-300'}`}>
            <Text style={{ color: theme.textColor }} className="font-bold text-[18px]">Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority('high')}
            className={`flex-1 p-4 rounded-lg items-center justify-center ${priority === 'high' ? 'bg-red-500' : 'bg-gray-300'}`}>
            <Text style={{ color: theme.textColor }} className="font-bold text-[18px]">High</Text>
          </TouchableOpacity>
        </View>

        {/* Category */}
        <View className="mb-5">
          <Text className="font-semibold text-[18px] mb-3" style={{ color: theme.textColor }}>
            Select Category
          </Text>
          <View className="flex-row justify-between space-x-2">
            <TouchableOpacity
              className={`flex-1 py-3 px-3 rounded-lg shadow-lg ${category === 'Hardware' ? 'bg-green-600' : 'bg-gray-200'} ${errorFields.category ? 'border border-red-500' : ''}`}
              onPress={() => handleCategorySelect('Hardware')}
            >
              <Text className={`text-[14.5px] font-medium text-center ${category === 'Hardware' ? 'text-white' : 'text-gray-700'}`} style={{ color: category === 'Hardware' ? 'white' : theme.textColor }}>
                Hardware
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-3 rounded-lg shadow-lg ${category === 'Software' ? 'bg-purple-600' : 'bg-gray-200'} ${errorFields.category ? 'border border-red-500' : ''}`}
              onPress={() => handleCategorySelect('Software')}
            >
              <Text className={`text-[16px] font-medium text-center ${category === 'Software' ? 'text-white' : 'text-gray-700'}`} style={{ color: category === 'Software' ? 'white' : theme.textColor }}>
                Software
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-3 rounded-lg shadow-lg ${category === 'Network' ? 'bg-blue-600' : 'bg-gray-200'} ${errorFields.category ? 'border border-red-500' : ''}`}
              onPress={() => handleCategorySelect('Network')}
            >
              <Text className={`text-[16px] font-medium text-center ${category === 'Network' ? 'text-white' : 'text-gray-700'}`} style={{ color: category === 'Network' ? 'white' : theme.textColor }}>
                Network
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-3 rounded-lg shadow-lg ${category === 'User' ? 'bg-orange-600' : 'bg-gray-200'} ${errorFields.category ? 'border border-red-500' : ''}`}
              onPress={() => handleCategorySelect('User')}
            >
              <Text className={`text-[16px] font-medium text-center ${category === 'User' ? 'text-white' : 'text-gray-700'}`} style={{ color: category === 'User' ? 'white' : theme.textColor }}>
                User
              </Text>
            </TouchableOpacity>
          </View>
        </View>


      </View >

      {/* ปุ่มเลือกหรือถ่ายรูป */}

      <TouchableOpacity
        className="flex-row items-center  rounded-lg  py-3 space-x-3"
        onPress={() => setModalVisible(true)}
      >
        {/* ไอคอนกล้อง */}
        <MaterialCommunityIcons name="camera" size={24} color={theme.textColor} />

        {/* ข้อความในปุ่ม */}
        <Text className="text-white font-bold text-lg" style={{ color: theme.textColor }}>
          Attach an image
        </Text>
      </TouchableOpacity>

      {/* แสดงรูปที่เลือก */}
      {selectedImage && (
        <View className="mt-5 items-center">
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: 300,
              height: (300 * imageDimensions.height) / imageDimensions.width, // ปรับตามอัตราส่วนของภาพ
              borderRadius: 10, // ปรับให้ภาพมีขอบมนเล็กน้อย
            }}
          />
          <TouchableOpacity
            className="bg-red-500 py-2 px-4 mt-4 rounded-lg"
            onPress={removeImage}
          >
            <Text className="text-white">Remove Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal เลือกรูปภาพ */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-center text-xl font-bold mb-5">Select Image</Text>

            {/* ปุ่มกล้อง */}
            <Pressable
              className="bg-blue-500 py-3 rounded-lg mb-3 items-center"
              onPress={takePhotoWithCamera}
            >
              <Text className="text-white font-bold">Take Photo</Text>
            </Pressable>

            {/* ปุ่มแกลเลอรี่ */}
            <Pressable
              className="bg-green-500 py-3 rounded-lg mb-3 items-center"
              onPress={selectImageFromLibrary}
            >
              <Text className="text-white font-bold">Choose from Gallery</Text>
            </Pressable>

            {/* ปิด Modal */}
            <Pressable
              className="bg-red-500 py-3 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>




      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-600 rounded-lg p-4 items-center mb-14 mt-14 "
        onPress={handleCreateTicket}>
        <Text className="text-white text-lg font-bold">Submit</Text>
      </TouchableOpacity>


      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/60">
          {/* วงกลมหมุนเพื่อแสดงสถานะ Loading */}
          <View className="flex items-center">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white text-lg font-semibold mt-4">Please wait...</Text>
          </View>
        </View>
      )}

    </ScrollView >
  );
};

export default CreateTicketScreen;
