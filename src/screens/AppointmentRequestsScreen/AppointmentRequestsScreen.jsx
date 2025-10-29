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
  rejectAppointment,
  confirmAppointment,
  subscribeToUserPendingRequests,
} from '../../apis/services';
import { formatTimestamp } from '../../utils/utils';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton/ServiceCardSkeleton';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';

const NO_IMAGE = 'https://via.placeholder.com/50';

const AppointmentRequestsScreen = ({ navigation }) => {
  const { user, userData } = useContext(AuthContext);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (user && user.uid) {
      setLoading(true);
      unsubscribe = subscribeToUserPendingRequests(
        user.uid,
        newRequests => {
          setUserRequests(newRequests);
          setLoading(false);
        },
        error => {
          console.error('Error subscribing to user requests:', error);
          setUserRequests([]);
          setLoading(false);
        },
      );
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const handleAcceptPress = item => {
    setSelectedRequest(item);
    setAcceptModalVisible(true);
  };

  const handleCancelPress = item => {
    setSelectedRequest(item);
    setCancelModalVisible(true);
  };

  const handleAcceptAppointment = async (appointmentId, shopId) => {
    try {
      setConfirming(true);
      await confirmAppointment(
        appointmentId,
        shopId,
        userData?.parlourName,
        userData?.profileImage,
      );
      setAcceptModalVisible(false);
    } catch (error) {
      console.error('Error confirming appointment:', error);
    } finally {
      setConfirming(false);
    }
  };

  const handleRejectAppointment = async (appointmentId, shopId) => {
    try {
      setCancelling(true);
      await rejectAppointment(appointmentId, shopId);
      setCancelModalVisible(false);
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
            typeof item.expert?.imageUrl === 'string'
              ? item.expert.imageUrl
              : NO_IMAGE,
        }}
        style={styles.avatar}
      />
      <View style={styles.requestInfo}>
        <Text style={styles.requesterName}>
          {item.expert?.expertName ?? ''}
        </Text>
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
          <Text style={styles.cancelButtonText}>Reject</Text>
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
          {selectedRequest?.services?.map((service, index) => (
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
              {selectedRequest?.offerPrice ?? selectedRequest?.totalAmount ?? 0}
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
          <Text style={styles.modalTitle}>Reason for Reject</Text>
          <Text>Do you want to reject the appointment request ?</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={() => {
                handleRejectAppointment(
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
              disabled={cancelling}
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
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => setLoading(true)}
            disabled={true}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="sync-circle-outline" size={24} color="#fff" />
            )}
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>User Request</Text>
        {loading && userRequests.length === 0 ? (
          <ServiceCardSkeleton />
        ) : userRequests.length === 0 ? (
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
    alignItems: 'flex-end',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.5)',
  },
});

export default AppointmentRequestsScreen;
