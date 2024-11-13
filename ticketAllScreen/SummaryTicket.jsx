import * as React from 'react';
import { Text, View, useWindowDimensions, ScrollView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { BarChart, LineChart, PieChart, ProgressChart, ContributionGraph } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
};

const chartStyle = { marginVertical: 8, borderRadius: 16 };

// หน้าสรุปรายเดือน
const MonthlySummary = () => {
  const [summaryData, setSummaryData] = React.useState(null);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        const documentId = '202410';
        const docRef = db.collection('monthlySummaries').doc(documentId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          setSummaryData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };
    fetchSummary();
  }, []);

  if (!summaryData) {
    return <Text>กำลังโหลดข้อมูล...</Text>;
  }

  // ข้อมูลสำหรับแต่ละกราฟ
  const barChartData = {
    labels: Object.keys(summaryData.jobsByCategory || {}),
    datasets: [{ data: Object.values(summaryData.jobsByCategory || {}) }],
  };

  const pieChartData = Object.keys(summaryData.workingTimeByCategory || {}).map((key, index) => ({
    name: key,
    time: summaryData.workingTimeByCategory[key],
    color: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1'][index % 4],
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  const progressChartData = {
    labels: Object.keys(summaryData.workingTimeByCategory || {}),
    data: Object.values(summaryData.workingTimeByCategory || {}).map(val => val / summaryData.totalWorkingTime),
  };

  const lineChartData = {
    labels: Object.keys(summaryData.jobsByCategory || {}),
    datasets: [{ data: Object.values(summaryData.jobsByCategory || {}) }],
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>สรุปรายเดือน</Text>

      <Text style={{ fontSize: 18, marginTop: 16 }}>จำนวนงานแยกตามประเภท</Text>
      <BarChart data={barChartData} width={300} height={220} chartConfig={chartConfig} style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>เวลาการทำงานแยกตามประเภทงาน</Text>
      <PieChart data={pieChartData} width={300} height={220} chartConfig={chartConfig} accessor="time" style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>อัตราการทำงานแต่ละประเภท</Text>
      <ProgressChart data={progressChartData} width={300} height={220} chartConfig={chartConfig} style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>กราฟเส้นตามประเภทงาน</Text>
      <LineChart data={lineChartData} width={300} height={220} chartConfig={chartConfig} style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>เวลาทำงานรวมของผู้ดูแล</Text>
      <Text style={{ fontSize: 16, color: '#333', marginTop: 8 }}>{summaryData.totalAdminWorkingTime} ชั่วโมง</Text>
    </ScrollView>
  );
};

// หน้าสรุปรายบุคคล
const IndividualSummary = () => {
  const [individualData, setIndividualData] = React.useState(null);

  React.useEffect(() => {
    const fetchIndividualSummary = async () => {
      try {
        const documentId = 'individual_summary_id';
        const docRef = db.collection('individualSummaries').doc(documentId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          setIndividualData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching individual summary data:", error);
      }
    };
    fetchIndividualSummary();
  }, []);

  if (!individualData) {
    return <Text>กำลังโหลดข้อมูล...</Text>;
  }

  const barChartData = {
    labels: Object.keys(individualData.tasksByType || {}),
    datasets: [{ data: Object.values(individualData.tasksByType || {}) }],
  };

  const pieChartData = Object.keys(individualData.timeByTaskType || {}).map((key, index) => ({
    name: key,
    time: individualData.timeByTaskType[key],
    color: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1'][index % 4],
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  const progressChartData = {
    labels: Object.keys(individualData.timeByTaskType || {}),
    data: Object.values(individualData.timeByTaskType || {}).map(val => val / individualData.totalWorkingTime),
  };

  const lineChartData = {
    labels: Object.keys(individualData.tasksByType || {}),
    datasets: [{ data: Object.values(individualData.tasksByType || {}) }],
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>สรุปรายคน</Text>

      <Text style={{ fontSize: 18, marginTop: 16 }}>จำนวนงานแยกตามประเภท</Text>
      <BarChart data={barChartData} width={300} height={220} chartConfig={chartConfig} style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>เวลาการทำงานแยกตามประเภทงาน</Text>
      <PieChart data={pieChartData} width={300} height={220} chartConfig={chartConfig} accessor="time" style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>อัตราการทำงานแต่ละประเภท</Text>
      <ProgressChart data={progressChartData} width={300} height={220} chartConfig={chartConfig} style={chartStyle} />

      <Text style={{ fontSize: 18, marginTop: 16 }}>กราฟเส้นตามประเภทงาน</Text>
      <LineChart data={lineChartData} width={300} height={220} chartConfig={chartConfig} style={chartStyle} />
    </ScrollView>
  );
};

export default function TabViewExample() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'monthly', title: 'สรุปรายเดือน' },
    { key: 'individual', title: 'สรุปรายคน' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        switch (route.key) {
          case 'monthly':
            return <MonthlySummary />;
          case 'individual':
            return <IndividualSummary />;
          default:
            return null;
        }
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'black', height: 3 }}
          style={{ backgroundColor: '#ffffff' }}
          labelStyle={{ fontSize: 14, fontWeight: 'bold' }}
          activeColor="blue"
          inactiveColor="gray"
        />
      )}
    />
  );
}
