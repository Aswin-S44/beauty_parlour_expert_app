import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { primaryColor } from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { getNotificationsByShopId } from '../../apis/services';
import AllNotificationsScreenSkeleton from '../AllNotificationsScreenSkeleton/AllNotificationsScreenSkeleton';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { AVATAR_IMAGE } from '../../constants/images';
import { getNotificationTitle } from '../../constants/variables';

const AllNotificationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchNotifications = useCallback(async () => {
    if (user && user.uid) {
      setLoading(true);
      const res = await getNotificationsByShopId(user.uid);

      setLoading(false);
      setNotifications(res || []);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handleNotificationPress = async notification => {
    const updatedNotifications = notifications.map(item =>
      item.id === notification.id ? { ...item, isRead: true } : item,
    );
    setNotifications(updatedNotifications);
    navigation.navigate('NofificationDetailsScreen', {
      notificationId: notification?.id,
    });
  };

  const deleteNotification = id => {
    setNotifications(notifications.filter(item => item.id !== id));
  };

  const renderRightActions = (progress, dragX, notification) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(notification.id)}
      >
        <Icons name="trash-can-outline" size={20} color="#E84F67" />
      </TouchableOpacity>
    );
  };

  const renderNotificationItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <TouchableOpacity
        style={[
          styles.notificationItem,
          item.isRead && styles.readNotification,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <Image
          source={{
            uri: item?.profileImage || AVATAR_IMAGE,
          }}
          style={styles.avatar}
        />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>
            {/* {item.notificationType === 'appointment_request'
              ? 'Appointment Request'
              : 'Notification'} */}
            Appointment request
          </Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt._seconds * 1000).toLocaleString()}
          </Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Swipeable>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Notifications</Text>
        {loading ? (
          <AllNotificationsScreenSkeleton />
        ) : !loading && notifications.length === 0 ? (
          <EmptyComponent title="No notifications available" />
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 120,
    justifyContent: 'center',
    paddingTop: 20,
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.6)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 10,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
  },
  readNotification: {
    backgroundColor: '#ffffff',
    borderLeftColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
    borderRadius: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
});

export default AllNotificationScreen;
