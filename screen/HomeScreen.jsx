import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  StatusBar,
  Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

const notifications = [
  { id: '1', title: 'ระบบจะปิดปรับปรุง', description: 'วันที่ 20 พ.ย. เวลา 18:00 น.' },
  { id: '2', title: 'อัปเดตความปลอดภัย', description: 'กรุณาเปลี่ยนรหัสผ่านของคุณ.' },
  { id: '3', title: 'กิจกรรม', description: 'เข้าร่วมกิจกรรม Team Building วันที่ 25 พ.ย.' },
];

const newsData = [
  {
    id: '1',
    title: 'ระบบจะปิดปรับปรุง',
    description: 'ระบบจะปิดปรับปรุงวันที่ 20 พ.ย. เวลา 18:00 น.',
    image: 'https://cdn-icons-png.flaticon.com/512/4270/4270981.png',
  },
  {
    id: '2',
    title: 'การอัปเดตความปลอดภัย',
    description: 'กรุณาอย่าแชร์รหัสผ่านเพื่อความปลอดภัย.',
    image: 'https://cdn-icons-png.flaticon.com/512/4212/4212408.png',
  },
  {
    id: '3',
    title: 'กิจกรรมประจำปี',
    description: 'ร่วมกิจกรรม Team Building วันที่ 25 พ.ย.',
    image: 'https://cdn-icons-png.flaticon.com/512/2548/2548537.png',
  },
];

const categoriesData = [
  { id: '1', name: 'ฮาร์ดแวร์', icon: 'https://cdn-icons-png.flaticon.com/512/2285/2285583.png' },
  { id: '2', name: 'เครือข่าย', icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png' },
  { id: '3', name: 'บัญชีผู้ใช้', icon: 'https://cdn-icons-png.flaticon.com/512/2845/2845521.png' },
  { id: '4', name: 'ซอฟต์แวร์', icon: 'https://cdn-icons-png.flaticon.com/512/759/759739.png' },
  { id: '5', name: 'ปัญหาอีเมล', icon: 'https://cdn-icons-png.flaticon.com/512/732/732223.png' },
  { id: '6', name: 'เครื่องพิมพ์', icon: 'https://cdn-icons-png.flaticon.com/512/3303/3303893.png' },
];

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const newsListRef = useRef(null); // ใช้เพื่ออ้างอิง FlatList
  let autoScrollInterval = useRef(null); // ใช้เพื่อเก็บ interval

  const user = {
    name: 'คุณสมชาย ใจดี',
    status: 'ออนไลน์',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };

  // เริ่มเลื่อนอัตโนมัติ
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % newsData.length;
        newsListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // 3 วินาที

    return () => clearInterval(autoScrollInterval.current); // เคลียร์ interval เมื่อ component ถูก unmount
  }, []);

  const handleCategoryPress = (category) => {
    alert(`คุณเลือกหมวดหมู่: ${category.name}`);
  };

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (width * 0.85));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6a11cb" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>สวัสดี,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.appName}>IT Helpdesk</Text>
          <TouchableOpacity style={styles.notificationIcon}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/786/786205.png',
              }}
              style={styles.bellIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* News Section */}
        <View style={styles.newsSection}>
          <FlatList
            ref={newsListRef}
            data={newsData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onScroll={onScroll}
            renderItem={({ item }) => (
              <View style={styles.newsCard}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsDescription}>{item.description}</Text>
              </View>
            )}
          />
          <View style={styles.pagination}>
            {newsData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.sectionTitle}>หมวดหมู่ปัญหา</Text>
            <TouchableOpacity onPress={() => setShowAllCategories(!showAllCategories)}>
              <Text style={styles.viewAllText}>
                {showAllCategories ? 'View Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal={!showAllCategories} showsHorizontalScrollIndicator={false}>
            <View style={showAllCategories ? styles.categoriesGrid : styles.categoriesRow}>
              {categoriesData.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category)}
                >
                  <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#6a11cb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '300',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 15,
  },
  notificationIcon: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 3,
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  newsSection: {
    marginVertical: 20,
  },
  newsCard: {
    width: width * 0.85,
    marginHorizontal: width * 0.075,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  newsDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#6a11cb',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#6a11cb',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesRow: {
    flexDirection: 'row',
  },
  categoriesGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  categoryCard: {
    backgroundColor: '#fff',
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 3,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});


export default HomeScreen;
