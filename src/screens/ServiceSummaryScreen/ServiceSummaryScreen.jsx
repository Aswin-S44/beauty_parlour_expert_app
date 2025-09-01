import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { useRoute } from '@react-navigation/native';
import { formatDate } from '../../utils/utils';
import { Image } from 'react-native';

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
              source={require('../../assets/images/users/2.png')}
              style={styles.avatar}
            />
            <Text style={styles.expertName}>Jesika Sabnom</Text>
            <Text style={styles.expertSpecialty}>Spa & Skin Specialist</Text>
            {/* <StarRating rating={4.9} count={150} /> */}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <Row
              label="Date"
              value={item.selectedDate ? formatDate(item.selectedDate) : ''}
            />
            <Row label="Time" value={item.selectedTime ?? '_'} />
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
              {item.services.map(service => (
                <AmountRow
                  service={service.serviceName ?? '-'}
                  qty={service?.qty ?? 1}
                  price={service?.servicePrice ?? '-'}
                />
              ))}
            </View>

            <View style={styles.separator} />

            <AmountRow
              service="Subtotal"
              qty={item.services[0]?.qty ?? 1}
              price={item.services[0].servicePrice ?? 0}
            />
            {item.offerAvailable && (
              <AmountRow
                service="Discount by offer"
                qty={item.service?.qty ?? 1}
                price={item.offerPrice}
              />
            )}

            <View style={styles.separator} />

            <AmountRow
              service="Total"
              qty={item.services[0]?.qty ?? 1}
              price={
                item.offerAvailable
                  ? item.offerPrice
                  : item.services[0].servicePrice
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
    fontWeight: '400',
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
    fontWeight: 'bold',
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
});

export default ServiceSummaryScreen;
