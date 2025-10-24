import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { useRoute } from '@react-navigation/native';
import { formatDate, formatServiceName } from '../../utils/utils';
import { Image } from 'react-native';
import { AVATAR_IMAGE } from '../../constants/images';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.text}>{label}</Text>
    <Text style={styles.text}>{value}</Text>
  </View>
);

const AmountRow = ({ service, qty, price, isBold = false }) => (
  <View style={styles.amountRow}>
    <Text style={[styles.amountCell, { flex: 2 }, isBold && styles.boldText]}>
      {service}
    </Text>
    <Text style={[styles.amountCell, isBold && styles.boldText]}>{qty}</Text>
    <Text
      style={[
        styles.amountCell,
        { textAlign: 'right' },
        isBold && styles.boldText,
      ]}
    >
      {price}
    </Text>
  </View>
);

const ServiceSummaryScreen = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  console.log('ITEM-------------', item ? item : 'no item');

  const [modalVisible, setModalVisible] = useState(false);

  const getStatusStyle = status => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const handleCall = phoneNumber => {
    if (phoneNumber && phoneNumber.trim() !== '') {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert('Phone number not available');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={styles.modalText}>
              Successfully send your request. Waiting for confirmation.
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.mainTitle}>Service Summary</Text>

          <View style={styles.profileSection}>
            <Image
              source={{ uri: item.expert.imageUrl ?? AVATAR_IMAGE }}
              style={styles.avatar}
            />
            <Text style={styles.expertName}>
              {item?.expert?.expertName ?? '-'}
            </Text>
            <Text style={styles.expertSpecialty}>
              {item?.expert?.specialist
                ? formatServiceName(item?.expert?.specialist)
                : '-'}
            </Text>
          </View>
                
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Details</Text>
            <Row
              label="Date"
              value={item.selectedDate ? formatDate(item.selectedDate) : ''}
            />
            <Row label="Time" value={item.selectedTime ?? '_'} />
            <View style={styles.row}>
              <Text style={styles.text}>Status</Text>
              <Text
                style={[
                  styles.statusText,
                  getStatusStyle(item.appointmentStatus),
                ]}
              >
                {item.appointmentStatus
                  ? item.appointmentStatus.toUpperCase()
                  : '-'}
              </Text>
            </View>
          </View>
          {console.log('ITEM-------------', item ? item : 'no item')}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Row
              label="Name"
              value={
                item.customer ? item.customer?.fullName ?? 'Unavailable' : '_'
              }
            />
            {/* <Row
              label="Phone number"
              value={
                item.customer?.phone?.trim() == ''
                  ? 'Unavailable'
                  : item.customer?.phone
              }
            /> */}
            <View style={styles.row}>
              <Text style={styles.text}>Phone</Text>
              {item.customer?.phone?.trim() == '' ? (
                <Text>Unavailable</Text>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      handleCall(item.customer?.phone.trim());
                    }}
                    style={styles.iconButton}
                  >
                    <View style={styles.row}>
                      <Text style={{ left: -20 }}>{item.customer?.phone}</Text>
                      <Icon name="call" size={22} color="green" />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Row
              label="Email"
              value={
                item.customer?.email?.trim() == ''
                  ? 'Unavailable'
                  : item.customer?.email
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <View>
              <View style={styles.amountHeader}>
                <Text style={[styles.amountCell, styles.boldText, { flex: 2 }]}>
                  Service
                </Text>
                <Text style={[styles.amountCell, styles.boldText]}>
                  Quantity
                </Text>
                <Text
                  style={[
                    styles.amountCell,
                    styles.boldText,
                    { textAlign: 'right' },
                  ]}
                >
                  Price
                </Text>
              </View>
              {item.services.map((service, index) => (
                <>
                  <AmountRow
                    key={index}
                    service={service.serviceName ?? '-'}
                    qty={service?.qty ?? 1}
                    price={service?.servicePrice ?? '-'}
                  />
                </>
              ))}
            </View>

            <View style={styles.separator} />

            <AmountRow
              service="Subtotal"
              qty={item.services[0]?.qty ?? 1}
              price={item.services.reduce(
                (sum, service) =>
                  sum + service.servicePrice * (service.qty || 1),
                0,
              )}
            />
            {item?.offers?.length > 0 && (
              <AmountRow
                service="Discount by offer"
                qty={item?.offers?.length ?? 1}
                price={item?.offers[0]?.offerPrice ?? 0}
              />
            )}

            {item?.offerAvailable && (
              <AmountRow
                service="Discount by offer"
                qty={1}
                price={item?.offerPrice ?? 0}
              />
            )}

            <View style={styles.separator} />

            <AmountRow
              service="Total"
              qty={item.services[0]?.qty ?? 1}
              price={
                item?.offers?.length > 0
                  ? (item.services[0]?.servicePrice ?? 0) -
                    (item.offers[0]?.offerPrice ?? 0)
                  : (item.services[0]?.servicePrice ?? 0) -
                    (item?.offerPrice ?? 0)
              }
              isBold={true}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: primaryColor,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginVertical: 25,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  amountHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  amountRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  amountCell: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: primaryColor,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  successIconContainer: {
    backgroundColor: primaryColor,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginVertical: 25,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  okButton: {
    backgroundColor: '#111',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  okButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  expertName: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
  },
  expertSpecialty: {
    fontSize: 16,
    color: '#777',
    marginVertical: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: 'hidden',
  },
  statusConfirmed: {
    backgroundColor: '#e6ffe6',
    color: '#008000',
  },
  statusPending: {
    backgroundColor: '#fffbe6',
    color: '#ffbf00',
  },
  statusCancelled: {
    backgroundColor: '#ffe6e6',
    color: '#cc0000',
  },
  statusDefault: {
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
});

export default ServiceSummaryScreen;
