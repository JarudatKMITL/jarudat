import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const SummaryTab = () => {
  const summaryData = {
    JobTotal: 144,
    jobsByCategory: { User: 20, Software: 20, Hardware: 20, Network: 20 },
    totalWorkingTime: "400 ชม.",
    workingTimeByCategory: { User: 53, Software: 119, Hardware: 161, Network: 147 },
    mostCommonCategory: "ซ่อมบำรุง",
    completedJobs: 80,
    inProgressJobs: 40,
    cancelledJobs: 24,
    avgByCategory: { User: 10, Software: 12, Hardware: 8, Network: 7 },
    avgByUser: { user1: 5, user2: 6, user3: 4 },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>สรุปรายเดือน</Text>

      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>จำนวนงานทั้งหมด</Text>
          <Text style={styles.cardValue}>{summaryData.JobTotal}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>เวลาทำงานรวม</Text>
          <Text style={styles.cardValue}>{summaryData.totalWorkingTime}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>หมวดหมู่ที่พบบ่อยที่สุด</Text>
          <Text style={styles.cardValue}>{summaryData.mostCommonCategory}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>งานที่สำเร็จ</Text>
          <Text style={styles.cardValue}>{summaryData.completedJobs}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>งานที่กำลังดำเนินการ</Text>
          <Text style={styles.cardValue}>{summaryData.inProgressJobs}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>งานที่ยกเลิก</Text>
          <Text style={styles.cardValue}>{summaryData.cancelledJobs}</Text>
        </Card>
      </View>

      <Divider style={styles.divider} />

      {/* Bar Chart for Jobs by Category */}
      <Text style={styles.sectionTitle}>จำนวนงานตามประเภท</Text>
      <BarChart
        data={{
          labels: Object.keys(summaryData.jobsByCategory),
          datasets: [{ data: Object.values(summaryData.jobsByCategory) }],
        }}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* Pie Chart for Working Time by Category */}
      <Text style={styles.sectionTitle}>เวลาทำงานตามประเภทงาน</Text>
      <PieChart
        data={[
          { name: 'User', population: summaryData.workingTimeByCategory.User, color: '#f39c12', legendFontColor: '#7F7F7F', legendFontSize: 15 },
          { name: 'Software', population: summaryData.workingTimeByCategory.Software, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
          { name: 'Hardware', population: summaryData.workingTimeByCategory.Hardware, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
          { name: 'Network', population: summaryData.workingTimeByCategory.Network, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        ]}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        style={styles.chart}
      />

      <Divider style={styles.divider} />

      {/* Average Jobs by Category */}
      <Text style={styles.sectionTitle}>ค่าเฉลี่ยงานแยกตามประเภท</Text>
      <View style={styles.summaryCards}>
        {Object.keys(summaryData.avgByCategory).map((category, index) => (
          <Card key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{category}</Text>
            <Text style={styles.cardValue}>{summaryData.avgByCategory[category]} งาน</Text>
          </Card>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Average Jobs by User */}
      <Text style={styles.sectionTitle}>ค่าเฉลี่ยงานต่อผู้ใช้งาน</Text>
      <View style={styles.summaryCards}>
        {Object.keys(summaryData.avgByUser).map((user, index) => (
          <Card key={index} style={styles.card}>
            <Text style={styles.cardTitle}>ผู้ใช้ {user}</Text>
            <Text style={styles.cardValue}>{summaryData.avgByUser[user]} งาน</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  summaryCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 15 },
  card: { width: '45%', padding: 15, marginVertical: 8, backgroundColor: '#FFF', borderRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  cardValue: { fontSize: 18, color: '#333', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginVertical: 10 },
  chart: { alignSelf: 'center', marginVertical: 10 },
  divider: { marginVertical: 15, backgroundColor: '#ddd' },
});

const chartConfig = {
  backgroundGradientFrom: '#FFF',
  backgroundGradientTo: '#FFF',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export default SummaryTab;
