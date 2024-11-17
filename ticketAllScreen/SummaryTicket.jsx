import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SummaryTab from './SummaryTab';
import AdminTab from './AdminTab';

const initialLayout = { width: Dimensions.get('window').width };

const SummaryTicketScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'summary', title: 'สรุปรายเดือน' },
    { key: 'admin', title: 'รายแอดมิน' },
  ]);

  const renderScene = SceneMap({
    summary: SummaryTab,
    admin: AdminTab,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#3498db', height: 3 }}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#3498db"
      inactiveColor="#333"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    elevation: 4, // ให้แถบเงา
  },
  tabLabel: {
    fontWeight: 'bold',
  },
});

export default SummaryTicketScreen;
