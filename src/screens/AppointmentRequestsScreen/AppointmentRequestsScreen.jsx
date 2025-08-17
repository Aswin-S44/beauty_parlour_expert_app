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
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';

const AppointmentRequestsScreen = ({ navigation }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requests = [
    {
      id: '1',
      name: 'Fahima Khan',
      datetime: '27 Dec 2020, 10:00pm',
      amount: '$350',
      image: 'https://i.imgur.com/7s1gG2g.png',
      isPrimary: true,
      details: {
        date: '25 August 2021',
        time: '08.00 pm',
        services: [
          { name: 'Style Hair Cut', quantity: '01', price: '$25' },
          { name: 'Spa', quantity: '01', price: '$100' },
          { name: 'Skin Treatment', quantity: '01', price: '$80' },
        ],
        subtotal: '$205',
        discount: '- $10',
        total: '$195',
      },
    },
    {
      id: '2',
      name: 'Mariya Tuba',
      datetime: '27 Dec 2020, 12:00pm',
      amount: '$78',
      image: 'https://i.imgur.com/uR7Yf46.png',
      details: {
        date: '27 Dec 2020',
        time: '12:00 pm',
        services: [{ name: 'Manicure', quantity: '01', price: '$78' }],
        subtotal: '$78',
        discount: '- $0',
        total: '$78',
      },
    },
    {
      id: '3',
      name: 'Sakina Josifa',
      datetime: '30 Dec 2020, 09:30pm',
      amount: '$450',
      image: 'https://i.imgur.com/C3fdoH7.png',
      details: {
        date: '30 Dec 2020',
        time: '09:30 pm',
        services: [
          { name: 'Full Makeup', quantity: '01', price: '$250' },
          { name: 'Hair Styling', quantity: '01', price: '$200' },
        ],
        subtotal: '$450',
        discount: '- $0',
        total: '$450',
      },
    },
  ];

  const handleAcceptPress = item => {
    setSelectedRequest(item);
    setAcceptModalVisible(true);
  };

  const handleCancelPress = item => {
    setSelectedRequest(item);
    setCancelModalVisible(true);
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.requestInfo}>
        <Text style={styles.requesterName}>{item.name}</Text>
        <Text style={styles.requestDetails}>{item.datetime}</Text>
        <Text style={styles.requestDetails}>Amount {item.amount}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleAcceptPress(item)}
          style={[
            styles.button,
            item.isPrimary ? styles.acceptButtonPrimary : styles.acceptButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              item.isPrimary
                ? styles.acceptButtonTextPrimary
                : styles.acceptButtonText,
            ]}
          >
            Accept
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCancelPress(item)}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
              {selectedRequest?.details.date}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {selectedRequest?.details.time}
            </Text>
          </View>

          <Text style={[styles.modalTitle, { marginTop: 20 }]}>Amount</Text>
          <View style={styles.amountHeaderRow}>
            <Text style={styles.amountHeader}>Service</Text>
            <Text style={styles.amountHeader}>Quantity</Text>
            <Text style={styles.amountHeader}>Price</Text>
          </View>
          {selectedRequest?.details.services.map((service, index) => (
            <View key={index} style={styles.amountRow}>
              <Text style={styles.serviceText}>{service.name}</Text>
              <Text style={styles.serviceText}>{service.quantity}</Text>
              <Text style={styles.serviceText}>{service.price}</Text>
            </View>
          ))}
          <View style={styles.lineSeparator} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {selectedRequest?.details.subtotal}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount by coupon</Text>
            <Text style={styles.summaryValue}>
              {selectedRequest?.details.discount}
            </Text>
          </View>
          <View style={styles.lineSeparator} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {selectedRequest?.details.total}
            </Text>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={() => setAcceptModalVisible(false)}
            >
              <Text style={styles.modalButtonTextPrimary}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setAcceptModalVisible(false)}
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
          <TextInput
            style={styles.reasonInput}
            placeholder="Enter reason here..."
            multiline
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalAcceptButton}
              onPress={() => setCancelModalVisible(false)}
            >
              <Text style={styles.modalButtonTextPrimary}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setCancelModalVisible(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>User Request</Text>
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />
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
  acceptButtonPrimary: {
    backgroundColor: primaryColor,
  },
  acceptButton: {
    backgroundColor: primaryColor,
  },
  cancelButton: {},
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  acceptButtonTextPrimary: {
    color: '#fff',
  },
  acceptButtonText: {
    color: primaryColor,
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
});

export default AppointmentRequestsScreen;
