import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getAppointmentsByShopId } from '../../apis/services';
import { convertFIrstCharToUpper, formatTimestamp } from '../../utils/utils';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton/ServiceCardSkeleton';

const NO_IMAGE = 'https://via.placeholder.com/150';

const AllAppointments = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointmentHistory = useCallback(async () => {
    if (user && user.uid) {
      setLoading(true);
      const res = await getAppointmentsByShopId(user.uid);
      setLoading(false);
      if (res) {
        setAppointments(res);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchAppointmentHistory();
  }, [fetchAppointmentHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppointmentHistory();
    setRefreshing(false);
  }, [fetchAppointmentHistory]);

  const getStatusStyle = status => {
    switch (status.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const renderAppointment = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ServiceSummaryScreen', { item })}
    >
      <Image
        source={{
          uri:
            typeof item.expert.imageUrl === 'string'
              ? item.expert.imageUrl
              : NO_IMAGE,
        }}
        style={styles.avatar}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.expert.expertName}</Text>
        <Text style={styles.itemDate}>
          {formatTimestamp(item.createdAt)} {'  '} {item.selectedTime}
        </Text>
        <Text style={styles.itemAmountText}>Amount {item.totalAmount}</Text>
      </View>
      <View style={styles.itemStatus}>
        <Text style={styles.itemPrice}>₹{item.totalAmount}</Text>
        <View
          style={[styles.statusBubble, getStatusStyle(item.appointmentStatus)]}
        >
          <Text style={styles.statusText}>
            {convertFIrstCharToUpper(item.appointmentStatus)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/home_bg-1.png')}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Appointment History</Text>

        {loading && !refreshing ? (
          <ServiceCardSkeleton />
        ) : !loading && appointments.length === 0 ? (
          <EmptyComponent />
        ) : (
          <FlatList
            data={appointments}
            renderItem={renderAppointment}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#800080']}
                tintColor={'#800080'}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 180,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.5)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  itemAmountText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  itemStatus: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 55,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  statusBubble: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusDefault: {
    backgroundColor: '#cccccc',
  },
  statusPending: {
    backgroundColor: '#ffc107',
  },
  statusConfirmed: {
    backgroundColor: '#17a2b8',
  },
  statusCompleted: {
    backgroundColor: '#28a745',
  },
  statusCancelled: {
    backgroundColor: '#dc3545',
  },
});

export default AllAppointments;
