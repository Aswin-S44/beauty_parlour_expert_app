import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import {
  cancelAppointment,
  confirmAppointment,
  getUserPendingRequests,
} from '../../apis/services';
import { formatTimestamp } from '../../utils/utils';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton/ServiceCardSkeleton';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';

const AppointmentRequestsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getUserPendingRequests(user.uid);
      if (res && res.length > 0) {
        setUserRequests(res);
      } else {
        setUserRequests([]);
      }
    } catch (err) {
      console.error('Error fetching user requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPress = item => {
    setSelectedRequest(item);
    setAcceptModalVisible(true);
  };

  const handleCancelPress = item => {
    setSelectedRequest(item);
    setCancellationReason('');
    setCancelModalVisible(true);
  };

  const handleAcceptAppointment = async (appointmentId, shopId) => {
    try {
      setConfirming(true);
      await confirmAppointment(appointmentId, shopId);
      setAcceptModalVisible(false);
      await fetchRequests();
    } catch (error) {
      return error;
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelAppointment = async (appointmentId, shopId) => {
    try {
      setCancelling(true);
      await cancelAppointment(appointmentId, shopId);
      setCancelModalVisible(false);
      await fetchRequests();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    } finally {
      setCancelling(false);
    }
  };

  const RenderRequestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestItem}
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
      <View style={styles.requestInfo}>
        <Text style={styles.requesterName}>{item.expert.expertName ?? ''}</Text>
        <Text style={styles.requestDetails}>
          {formatTimestamp(item.createdAt)} {'  '} {item.selectedTime}
        </Text>
        <Text style={styles.requestDetails}>Amount {item.totalAmount}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleAcceptPress(item)}
          style={[styles.button, styles.acceptButton]}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCancelPress(item)}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
              {selectedRequest?.selectedDate ?? ''}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {selectedRequest?.selectedTime ?? ''}
            </Text>
          </View>

          <Text style={[styles.modalTitle, { marginTop: 20 }]}>Amount</Text>
          <View style={styles.amountHeaderRow}>
            <Text style={styles.amountHeader}>Service</Text>
            <Text style={styles.amountHeader}>Quantity</Text>
            <Text style={styles.amountHeader}>Price</Text>
          </View>
          {selectedRequest?.services.map((service, index) => (
            <View key={index} style={styles.amountRow}>
              <Text style={styles.serviceText}>
                {service.serviceName ?? '_'}
              </Text>
              <Text style={styles.serviceText}>{service?.qty ?? 1}</Text>
              <Text style={styles.serviceText}>
                {service?.servicePrice * (service?.qty ?? 1) || '_'}
              </Text>
            </View>
          ))}
          <View style={styles.lineSeparator} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {selectedRequest?.totalAmount ?? 0}
            </Text>
          </View>
          {selectedRequest?.offerAvailable && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount price by Offer</Text>
              <Text style={styles.summaryValue}>
                {selectedRequest?.offerPrice ?? 0}
              </Text>
            </View>
          )}

          <View style={styles.lineSeparator} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {selectedRequest?.offerPrice ?? 0}
            </Text>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={() => {
                handleAcceptAppointment(
                  selectedRequest.id,
                  selectedRequest.shopId,
                );
              }}
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
          <Text style={styles.modalTitle}>Reason for Cancellation</Text>
          <Text>Do you want to cancel the appointment request ?</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={() => {
                handleCancelAppointment(
                  selectedRequest.id,
                  selectedRequest.shopId,
                );
              }}
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
              disabled={confirming}
            >
              <Text style={styles.modalButtonTextSecondary}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/images/home_bg-1.png')}
        style={styles.headerBackground}
      >
        <View style={styles.overlay} />
        <View style={styles.header}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity> */}
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>User Request</Text>
        {loading ? (
          <ServiceCardSkeleton />
        ) : !loading && userRequests.length === 0 ? (
          <EmptyComponent title="No user requests available" />
        ) : (
          <FlatList
            data={userRequests}
            renderItem={({ item }) => <RenderRequestItem item={item} />}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          />
        )}
      </View>

      {selectedRequest && renderAcceptModal()}
      {selectedRequest && renderCancelModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
  },
  headerBackground: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    paddingHorizontal: 20,
    marginTop: -30,
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  requestInfo: {
    flex: 1,
  },
  requesterName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  requestDetails: {
    fontSize: 13,
    color: 'gray',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: primaryColor,
  },
  cancelButton: {},
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  acceptButtonText: {
    color: '#fff',
  },
  cancelButtonText: {
    color: 'gray',
    fontSize: 12,
  },
  listSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 5,
    marginLeft: 65,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.5)',
  },
});

export default AppointmentRequestsScreen;
