import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {
  markNotificationAsRead,
  confirmAppointment,
  rejectAppointment,
  getNotificationDetails,
} from '../../apis/services';
import { NO_IMAGE } from '../../constants/variables';
import { primaryColor } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';

const NofificationDetailsScreen = ({ route, navigation }) => {
  const { notificationId } = route.params;
  const { user, userData } = useContext(AuthContext);

  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notificationId) {
      const fetchNotification = async () => {
        setLoading(true);
        let res = await getNotificationDetails(notificationId);
        if (res) {
          setNotificationDetails(res);
        }
        setLoading(false);
      };
      fetchNotification();
    }
  }, [notificationId]);

  useEffect(() => {
    if (notificationId) {
      const updateNotification = async () => {
        await markNotificationAsRead(notificationId);
      };
      updateNotification();
    }
  }, [notificationId]);

  const formatDate = (seconds, nanoseconds) => {
    if (seconds === undefined || nanoseconds === undefined) {
      return 'N/A';
    }
    return moment
      .unix(seconds + nanoseconds / 1_000_000_000)
      .format('MMMM Do YYYY, h:mm a');
  };

  const handleAcceptPress = () => {
    setAcceptModalVisible(true);
  };

  const handleCancelPress = () => {
    setCancelModalVisible(true);
  };

  const handleAcceptAppointment = async () => {
    try {
      setConfirming(true);
      if (
        notificationDetails &&
        notificationDetails?.appointmentId &&
        notificationDetails?.toId
      ) {
        await confirmAppointment(
          notificationDetails?.appointmentId,
          notificationDetails?.toId,
          userData?.parlourName,
          userData?.profileImage,
        );
        setAcceptModalVisible(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
    } finally {
      setConfirming(false);
    }
  };

  const handleRejectAppointment = async () => {
    try {
      setCancelling(true);
      if (
        notificationDetails &&
        notificationDetails?.appointmentId &&
        notificationDetails?.toId
      ) {
        await rejectAppointment(
          notificationDetails?.appointmentId,
          notificationDetails?.toId,
        );
        setCancelModalVisible(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
    } finally {
      setCancelling(false);
    }
  };

  const renderAcceptModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={acceptModalVisible}
      onRequestClose={() => setAcceptModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Date & Time</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {notificationDetails?.appointment?.selectedDate || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {notificationDetails?.appointment?.selectedTime || 'N/A'}
            </Text>
          </View>

          <Text style={[styles.modalTitle, { marginTop: 20 }]}>Amount</Text>
          <View style={styles.amountHeaderRow}>
            <Text style={styles.amountHeader}>Service</Text>
            <Text style={styles.amountHeader}>Quantity</Text>
            <Text style={styles.amountHeader}>Price</Text>
          </View>
          {notificationDetails?.appointment?.services &&
            notificationDetails?.appointment?.services?.map(
              (service, index) => (
                <View key={service.id || index} style={styles.amountRow}>
                  <Text style={styles.serviceText}>
                    {service.serviceName || 'N/A'}
                  </Text>
                  <Text style={styles.serviceText}>{service?.qty || 1}</Text>
                  <Text style={styles.serviceText}>
                    ₹{service.servicePrice * (service.qty || 1) || '0'}
                  </Text>
                </View>
              ),
            )}
          <View style={styles.lineSeparator} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>
              ₹{notificationDetails?.appointment?.totalAmount || '0'}
            </Text>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={handleAcceptAppointment}
              disabled={confirming}
            >
              {confirming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Accept</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setAcceptModalVisible(false)}
              disabled={confirming}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCancelModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={cancelModalVisible}
      onRequestClose={() => setCancelModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reason for Reject</Text>
          <Text>Do you want to reject the appointment request ?</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={handleRejectAppointment}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Yes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setCancelModalVisible(false)}
              disabled={cancelling}
            >
              <Text style={styles.modalButtonTextSecondary}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const isAppointmentRequest =
    notificationDetails?.notificationType === 'appointment_request';

  if (loading || !notificationDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Notification Details</Text>

          <View style={styles.card}>
            <Image
              source={{
                uri: notificationDetails?.customer?.profileImage || NO_IMAGE,
              }}
              style={styles.profileImage}
            />
            <Text style={styles.customerName}>
              {notificationDetails?.customer?.fullName || 'Unavailable'}
            </Text>
            <Text style={styles.notificationMessage}>
              "{notificationDetails?.message || 'No message provided.'}"
            </Text>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Notification Type:</Text>
              <Text style={styles.value}>
                {notificationDetails?.notificationType
                  ? notificationDetails?.notificationType
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, char => char.toUpperCase())
                  : 'Unavailable'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Received On:</Text>
              <Text style={styles.value}>
                {formatDate(
                  notificationDetails?.createdAt?._seconds,
                  notificationDetails?.createdAt?._nanoseconds,
                )}
              </Text>
            </View>

            {notificationDetails?.appointment && (
              <View style={styles.customerInfo}>
                <Text style={styles.customerInfoTitle}>
                  Appointment Details
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text style={styles.value}>
                    {notificationDetails?.appointment?.appointmentStatus
                      ? notificationDetails?.appointment?.appointmentStatus.replace(
                          /\b\w/g,
                          char => char.toUpperCase(),
                        )
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Date:</Text>
                  <Text style={styles.value}>
                    {notificationDetails?.appointment?.selectedDate || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>
                    {notificationDetails?.appointment?.selectedTime || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Total Amount:</Text>
                  <Text style={styles.value}>
                    ₹{notificationDetails?.appointment?.totalAmount || '0'}
                  </Text>
                </View>
              </View>
            )}

            {notificationDetails?.appointment?.services &&
              notificationDetails?.appointment?.services?.length > 0 && (
                <View style={styles.customerInfo}>
                  <Text style={styles.customerInfoTitle}>Services Booked</Text>
                  {notificationDetails?.appointment?.services?.map(
                    (service, index) => (
                      <View
                        key={service.id || index}
                        style={styles.serviceItem}
                      >
                        <Text style={styles.serviceName}>
                          {service?.serviceName || 'N/A'}
                        </Text>
                        <Text style={styles.servicePrice}>
                          ₹{service?.servicePrice || '0'}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              )}

            {isAppointmentRequest &&
              notificationDetails?.appointment?.appointmentStatus ===
                'pending' && (
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    onPress={handleAcceptPress}
                    style={[styles.actionButton, styles.acceptButton]}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelPress}
                    style={[styles.actionButton, styles.rejectButton]}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </ScrollView>
      </View>
      {renderAcceptModal()}
      {renderCancelModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    height: Platform.OS === 'ios' ? 120 : 100,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
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
    top: Platform.OS === 'ios' ? 50 : 30,
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
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#800080',
  },
  customerName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    fontStyle: 'italic',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  customerInfo: {
    marginTop: 25,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    alignItems: 'flex-start',
  },
  customerInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#800080',
    marginBottom: 15,
    alignSelf: 'center',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  serviceName: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#800080',
    textAlign: 'right',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    width: '100%',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: primaryColor,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  rejectButton: {
    backgroundColor: '#ff4d4d',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 15,
    color: '#4A4A4A',
  },
  detailValue: {
    fontSize: 15,
    color: '#4A4A4A',
  },
  amountHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountHeader: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    width: '33%',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 15,
    color: '#555',
    width: '33%',
  },
  lineSeparator: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#555',
  },
  summaryValue: {
    fontSize: 15,
    color: '#555',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    gap: 15,
  },
  modalAcceptButton: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  modalCancelButton: {
    backgroundColor: '#F3E5F5',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonTextSecondary: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NofificationDetailsScreen;
