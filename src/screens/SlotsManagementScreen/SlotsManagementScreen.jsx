import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  Modal,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

import { AuthContext } from '../../context/AuthContext';
import { primaryColor } from '../../constants/colors';
import { ScrollView } from 'react-native';
import SlotsSkeleton from '../../components/SlotsSkeleton/SlotsSkeleton';

const SlotsManagementScreen = ({ navigation }) => {
  const { user, userData } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [slots, setSlots] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [startTimeInput, setStartTimeInput] = useState('');
  const [endTimeInput, setEndTimeInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    // React Native Firebase realtime listener
    const unsubscribe = firestore()
      .collection('slots')
      .where('shopId', '==', user.uid)
      .onSnapshot(
        querySnapshot => {
          const slotsData = {};

          querySnapshot.forEach(doc => {
            const slot = { id: doc.id, ...doc.data() };
            const slotDate = slot.date;

            if (!slotsData[slotDate]) {
              slotsData[slotDate] = [];
            }

            slotsData[slotDate].push(slot);
          });

          setSlots(slotsData);
          setLoading(false);
        },
        error => {
          console.error('Error fetching slots:', error);
          setLoading(false);
          Alert.alert('Error', 'Failed to load slots');
        },
      );

    return () => unsubscribe();
  }, [user]);

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  const addSlotToFirestore = async slotData => {
    try {
      await firestore()
        .collection('slots')
        .add({
          ...slotData,
          shopId: user.uid,
          createdAt: new Date(),
        });
      return { success: true };
    } catch (error) {
      console.error('Error adding slot:', error);
      throw error;
    }
  };

  const updateSlotInFirestore = async (slotId, slotData) => {
    try {
      await firestore()
        .collection('slots')
        .doc(slotId)
        .update({
          ...slotData,
          updatedAt: new Date(),
        });
      return { success: true };
    } catch (error) {
      console.error('Error updating slot:', error);
      throw error;
    }
  };

  const deleteSlotFromFirestore = async slotId => {
    try {
      await firestore().collection('slots').doc(slotId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting slot:', error);
      throw error;
    }
  };

  const handleAddOrUpdateSlot = async () => {
    if (!startTimeInput || !endTimeInput) {
      Alert.alert('Missing Info', 'Please enter both start and end times.');
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTimeInput) || !timeRegex.test(endTimeInput)) {
      Alert.alert(
        'Invalid Format',
        'Please use HH:MM format for times (e.g., 09:00, 14:30).',
      );
      return;
    }

    const startMoment = moment(startTimeInput, 'HH:mm');
    const endMoment = moment(endTimeInput, 'HH:mm');

    if (endMoment.isSameOrBefore(startMoment)) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }

    const slotData = {
      date: selectedDate,
      startTime: startTimeInput,
      endTime: endTimeInput,
      isAvailable: true,
    };

    try {
      if (editingSlot) {
        await updateSlotInFirestore(editingSlot.id, slotData);
      } else {
        await addSlotToFirestore(slotData);
      }

      setModalVisible(false);
      setEditingSlot(null);
      setStartTimeInput('');
      setEndTimeInput('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save slot. Please try again.');
    }
  };

  const openAddSlotModal = () => {
    setEditingSlot(null);
    setStartTimeInput('');
    setEndTimeInput('');
    setModalVisible(true);
  };

  const openEditSlotModal = slot => {
    setEditingSlot(slot);
    setStartTimeInput(slot.startTime);
    setEndTimeInput(slot.endTime);
    setModalVisible(true);
  };

  const handleDeleteSlot = async slotId => {
    Alert.alert(
      'Delete Slot',
      'Are you sure you want to remove this slot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteSlotFromFirestore(slotId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete slot. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  const renderSlotItem = ({ item }) => {
    const statusText = item.isAvailable ? 'Available' : 'Booked';
    const statusColor = item.isAvailable ? '#B8E080' : '#ED5E3E';
    return (
      <View style={styles.slotItem}>
        {console.log('item : ', item)}
        <Text
          style={styles.slotTime}
        >{`${item.startTime} - ${item.endTime}`}</Text>
        <Text
          style={[
            styles.statusText,
            styles.chip,
            { backgroundColor: statusColor, color: '#fff', fontSize: 14 },
          ]}
        >
          {statusText}
        </Text>
        <View style={styles.slotActions}>
          <TouchableOpacity
            onPress={() => openEditSlotModal(item)}
            style={styles.actionIcon}
          >
            <Icon name="pencil-outline" size={20} color={primaryColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteSlot(item.id)}
            style={styles.actionIcon}
          >
            <Icon name="trash-can-outline" size={20} color="#E84F67" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const markedDates = {};
  Object.keys(slots).forEach(date => {
    markedDates[date] = { marked: true, dotColor: '#6200EE' };
  });
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: '#6200EE',
    selectedTextColor: '#FFFFFF',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={{ width: 60 }} /> {/* Spacer to balance title */}
      </View>
      <View style={styles.contentContainer}>
        {loading ? (
          <SlotsSkeleton />
        ) : (
          <>
            <Text style={styles.sectionHeader}>Manage Booking Slots</Text>

            <ScrollView>
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={onDayPress}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor: '#FFFFFF',
                    calendarBackground: '#FFFFFF',
                    textSectionTitleColor: primaryColor,
                    selectedDayBackgroundColor: primaryColor,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#6200EE',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: primaryColor,
                    selectedDotColor: '#ffffff',
                    arrowColor: primaryColor,
                    monthTextColor: '#2d4150',
                    indicatorColor: primaryColor,
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                  }}
                />
              </View>

              <View style={styles.slotListHeader}>
                <Text style={styles.slotListHeaderText}>
                  Slots for {moment(selectedDate).format('MMMM Do, YYYY')}
                </Text>
                <TouchableOpacity
                  onPress={openAddSlotModal}
                  style={styles.addSlotButton}
                >
                  <Icon
                    name="plus"
                    size={18}
                    color="#FFFFFF"
                    style={styles.addIcon}
                  />
                  <Text style={styles.addSlotButtonText}>Add Slot</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={slots[selectedDate] || []}
                renderItem={renderSlotItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <View style={styles.emptySlotsContainer}>
                    <Icon
                      name="calendar-remove-outline"
                      size={40}
                      color="#B0B0B0"
                    />
                    <Text style={styles.emptySlotsText}>
                      No slots configured for this date.
                    </Text>
                    <Text style={styles.emptySlotsSubText}>
                      Tap "Add Slot" to create new availability.
                    </Text>
                  </View>
                }
                style={styles.slotsList}
              />
            </ScrollView>
          </>
        )}
      </View>
      {/* Add/Edit Slot Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingSlot ? 'Edit Slot' : 'Create New Slot'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Start Time (HH:MM e.g., 10:00)"
              placeholderTextColor="#888"
              value={startTimeInput}
              onChangeText={setStartTimeInput}
              keyboardType="default"
              maxLength={5}
            />
            <TextInput
              style={styles.input}
              placeholder="End Time (HH:MM e.g., 11:00)"
              placeholderTextColor="#888"
              value={endTimeInput}
              onChangeText={setEndTimeInput}
              keyboardType="default"
              maxLength={5}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddOrUpdateSlot}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  {editingSlot ? 'Update Slot' : 'Add Slot'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ... (keep your styles the same)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: primaryColor,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 40,
    backgroundColor: primaryColor,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F7F8FC',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 15,
    paddingTop: 20,
    marginTop: -20,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  slotListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  slotListHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 2,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addIcon: {
    marginRight: 5,
  },
  addSlotButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  slotsList: {
    flex: 1,
  },
  slotItem: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#6200EE',
  },
  slotTime: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  slotActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 15,
    padding: 5,
  },
  emptySlotsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptySlotsText: {
    fontSize: 18,
    color: '#B0B0B0',
    marginTop: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySlotsSubText: {
    fontSize: 14,
    color: '#C0C0C0',
    marginTop: 5,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: primaryColor,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  chip: {
    padding: 4,
    borderRadius: 10,
  },
});

export default SlotsManagementScreen;
