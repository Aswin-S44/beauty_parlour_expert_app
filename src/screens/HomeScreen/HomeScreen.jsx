import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import React, { useContext } from 'react';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../../components/Card/Card';
import { primaryColor, secondaryColor } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const weeklyData = [
    { day: 'SAT', value: 2200, color: '#4A5568' },
    { day: 'SUN', value: 1500, color: '#E53E3E' },
    { day: 'MON', value: 2300, color: '#48BB78' },
    { day: 'TUE', value: 1300, color: '#F6E05E' },
    { day: 'WED', value: 1800, color: '#4299E1' },
    { day: 'THU', value: 1700, color: '#ED64A6' },
    { day: 'FRI', value: 2500, color: '#9F7AEA' },
  ];
  const maxValue = 2500;
  console.log('hello aseins');
  const { user, loading } = useContext(AuthContext);
  console.log('USER-----------', user ? user?.uid : 'no user');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="light-content"
      />

      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/images/home_bg-1.png')}
          style={styles.bannerImage}
        />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.hamburgerIconContainer}
          >
            <View style={[styles.hamburgerLine, { width: 25 }]} />
            <View style={[styles.hamburgerLine, { width: 20 }]} />
            <View style={[styles.hamburgerLine, { width: 25 }]} />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                width: 35,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color={primaryColor}
              />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>02</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Beauty Parlour</Text>
          <Text style={styles.bannerSubtitle}>Beauty Expert App</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <View style={styles.weeklyEarnHeader}>
            <Text style={styles.cardTitle}>WEEKLY EARN</Text>
            <Text style={styles.yAxisLabel}>2,500</Text>
          </View>
          <View style={styles.chartContainer}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
                <Text style={styles.xAxisLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.yAxisLabel, { alignSelf: 'flex-start' }]}>
            0
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Services</Text>
            <Text style={[styles.statNumber, { color: '#3182CE' }]}>2723</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Pending Services</Text>
            <Text style={[styles.statNumber, { color: '#DD6B20' }]}>523</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Completed Services</Text>
            <Text style={[styles.statNumber, { color: '#38A169' }]}>1524</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  bannerContainer: {
    height: 250,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  hamburgerIconContainer: {
    padding: 5,
  },
  hamburgerLine: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginVertical: 2,
  },
  badgeContainer: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: primaryColor,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 16,
  },
  mainContent: {
    paddingHorizontal: 15,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 20,
  },
  weeklyEarnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A0AEC0',
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingLeft: 10,
    paddingTop: 10,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    borderRadius: 5,
  },
  xAxisLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#718096',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    minHeight: 120,
  },
  statTitle: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default HomeScreen;
