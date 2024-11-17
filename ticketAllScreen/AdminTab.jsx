import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const AdminTab = () => {
  const adminData = {
    "Anan Chaiyasit": { Hardware: 161, Network: 147, Software: 119, User: 53, totalHours: 480 },
    "Somchai Deeja": { Hardware: 120, Network: 90, Software: 80, User: 30, totalHours: 320 },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>รายแอดมิน</Text>
      {Object.keys(adminData).map((admin, index) => (
        <View key={index} style={styles.adminSection}>
          <Card style={styles.adminCard}>
            <Text style={styles.adminName}>{admin}</Text>
            <Text style={styles.adminHours}>เวลาทำงานรวม: {adminData[admin].totalHours} ชั่วโมง</Text>
            <PieChart
              data={[
                { name: 'User', population: adminData[admin].User, color: '#f39c12', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                { name: 'Hardware', population: adminData[admin].Hardware, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                { name: 'Software', population: adminData[admin].Software, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                { name: 'Network', population: adminData[admin].Network, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
              ]}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              style={styles.chart}
            />
          </Card>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    adminSection: { marginBottom: 15 },
    adminCard: { padding: 15, backgroundColor: '#FFF', borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    adminName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    adminHours: { fontSize: 14, color: '#555', marginBottom: 10 },
    chart: { alignSelf: 'center', marginVertical: 10 },
  });
  
  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };
  
  export default AdminTab;
  
