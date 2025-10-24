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
  StatusBar,
  Switch,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthContext } from '../../context/AuthContext';
import { primaryColor } from '../../constants/colors';
import SlotsSkeleton from '../../components/SlotsSkeleton/SlotsSkeleton';
import { COLLECTIONS } from '../../constants/collections';

const SlotsManagementScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [slots, setSlots] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repeatSlotsDaily, setRepeatSlotsDaily] = useState(false);
  const [holidays, setHolidays] = useState({});
  const [repeatUntilDate, setRepeatUntilDate] = useState('');
  const [repeatUntilModalVisible, setRepeatUntilModalVisible] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    const unsubscribeSlots = firestore()
      .collection(COLLECTIONS.SLOTS)
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

    const unsubscribeHolidays = firestore()
      .collection(COLLECTIONS.HOLIDAYS)
      .where('shopId', '==', user.uid)
      .onSnapshot(
        querySnapshot => {
          const holidaysData = {};
          querySnapshot.forEach(doc => {
            const holiday = { id: doc.id, ...doc.data() };
            holidaysData[holiday.date] = true;
          });
          setHolidays(holidaysData);
        },
        error => {
          console.error('Error fetching holidays:', error);
        },
      );

    return () => {
      unsubscribeSlots();
      unsubscribeHolidays();
    };
  }, [user]);

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  const addSlotToFirestore = async slotData => {
    try {
      await firestore()
        .collection(COLLECTIONS.SLOTS)
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
        .collection(COLLECTIONS.SLOTS)
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
      await firestore().collection(COLLECTIONS.SLOTS).doc(slotId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting slot:', error);
      throw error;
    }
  };

  const addHolidayToFirestore = async date => {
    try {
      await firestore().collection(COLLECTIONS.HOLIDAYS).add({
        date,
        shopId: user.uid,
        createdAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding holiday:', error);
      throw error;
    }
  };

  const deleteHolidayFromFirestore = async date => {
    try {
      const querySnapshot = await firestore()
        .collection(COLLECTIONS.HOLIDAYS)
        .where('shopId', '==', user.uid)
        .where('date', '==', date)
        .get();

      if (!querySnapshot.empty) {
        await firestore()
          .collection(COLLECTIONS.HOLIDAYS)
          .doc(querySnapshot.docs[0].id)
          .delete();
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  };

  const handleAddOrUpdateSlot = async () => {
    const startMoment = moment(startTime);
    const endMoment = moment(endTime);

    if (endMoment.isSameOrBefore(startMoment)) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }

    const baseSlotData = {
      startTime: startMoment.format('HH:mm'),
      endTime: endMoment.format('HH:mm'),
      isAvailable: true,
      isRecurring: false,
    };

    try {
      if (editingSlot) {
        await updateSlotInFirestore(editingSlot.id, {
          ...baseSlotData,
          date: editingSlot.date,
        });
      } else {
        await addSlotToFirestore({ ...baseSlotData, date: selectedDate });
      }

      setModalVisible(false);
      setEditingSlot(null);
      setStartTime(new Date());
      setEndTime(new Date());
    } catch (error) {
      Alert.alert('Error', 'Failed to save slot. Please try again.');
    }
  };

  const openAddSlotModal = () => {
    setEditingSlot(null);
    setStartTime(new Date());
    setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
    setModalVisible(true);
  };

  const openEditSlotModal = slot => {
    setEditingSlot(slot);
    setStartTime(moment(slot.startTime, 'HH:mm').toDate());
    setEndTime(moment(slot.endTime, 'HH:mm').toDate());
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

  const handleToggleHoliday = async () => {
    if (holidays[selectedDate]) {
      Alert.alert(
        'Remove Holiday',
        `Are you sure you want to remove the holiday status for ${moment(
          selectedDate,
        ).format('MMMM Do, YYYY')}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            onPress: async () => {
              try {
                await deleteHolidayFromFirestore(selectedDate);
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to remove holiday. Please try again.',
                );
              }
            },
            style: 'destructive',
          },
        ],
      );
    } else {
      Alert.alert(
        'Add Holiday',
        `Are you sure you want to mark ${moment(selectedDate).format(
          'MMMM Do, YYYY',
        )} as a holiday? All existing slots for this day will be considered unavailable.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: async () => {
              try {
                await addHolidayToFirestore(selectedDate);
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to add holiday. Please try again.',
                );
              }
            },
            style: 'default',
          },
        ],
      );
    }
  };

  const handleRepeatSlotsDailyToggle = async value => {
    setRepeatSlotsDaily(value);
    if (value) {
      setRepeatUntilModalVisible(true);
    } else {
      Alert.alert(
        'Stop Repeating Slots',
        'Turning off daily repeat will not remove previously repeated slots. You will need to delete them manually if no longer needed.',
        [{ text: 'Ok', style: 'default' }],
      );
    }
  };

  const handleRepeatSlotsConfirm = async () => {
    setRepeatUntilModalVisible(false);

    if (!repeatUntilDate || !moment(repeatUntilDate, 'YYYY-MM-DD').isValid()) {
      Alert.alert('Invalid Date', 'Please select a valid repeat until date.');
      setRepeatSlotsDaily(false);
      return;
    }

    const confirmation = await new Promise(resolve =>
      Alert.alert(
        'Repeat Slots Daily',
        `All slots configured for ${moment(selectedDate).format(
          'MMMM Do, YYYY',
        )} will be copied to every day from ${moment(selectedDate)
          .add(1, 'day')
          .format('MMMM Do, YYYY')} until ${moment(repeatUntilDate).format(
          'MMMM Do, YYYY',
        )}. Do you want to proceed?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setRepeatSlotsDaily(false);
              resolve(false);
            },
          },
          { text: 'Confirm', onPress: () => resolve(true) },
        ],
        { cancelable: false },
      ),
    );
    if (!confirmation) return;

    const currentDaySlots = slots[selectedDate] || [];
    if (currentDaySlots.length === 0) {
      Alert.alert('No Slots', 'There are no slots to repeat for this day.');
      setRepeatSlotsDaily(false);
      return;
    }

    try {
      const batch = firestore().batch();
      let currentDate = moment(selectedDate).add(1, 'day');
      const untilDate = moment(repeatUntilDate);

      while (currentDate.isSameOrBefore(untilDate, 'day')) {
        const dateString = currentDate.format('YYYY-MM-DD');
        if (!holidays[dateString]) {
          const existingSlotsForDate = slots[dateString] || [];
          currentDaySlots.forEach(slot => {
            const isDuplicate = existingSlotsForDate.some(
              existingSlot =>
                existingSlot.startTime === slot.startTime &&
                existingSlot.endTime === slot.endTime,
            );
            if (!isDuplicate) {
              const slotRef = firestore().collection(COLLECTIONS.SLOTS).doc();
              batch.set(slotRef, {
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: true,
                isRecurring: true,
                date: dateString,
                shopId: user.uid,
                createdAt: new Date(),
              });
            }
          });
        }
        currentDate.add(1, 'day');
      }
      await batch.commit();
      Alert.alert('Success', 'Slots have been repeated daily.');
    } catch (error) {
      console.error('Error repeating slots daily:', error);
      Alert.alert('Error', 'Failed to repeat slots daily. Please try again.');
      setRepeatSlotsDaily(false);
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const renderSlotItem = ({ item }) => {
    const isHoliday = holidays[selectedDate];
    const statusText = isHoliday
      ? 'Holiday'
      : item.isAvailable
      ? 'Available'
      : 'Booked';
    const statusColor = isHoliday
      ? '#FFC107'
      : item.isAvailable
      ? '#B8E080'
      : '#ED5E3E';
    const slotStyle = isHoliday ? styles.slotItemHoliday : styles.slotItem;

    return (
      <View style={slotStyle}>
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
        {!isHoliday && (
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
        )}
      </View>
    );
  };

  const markedDates = {};
  Object.keys(slots).forEach(date => {
    markedDates[date] = { marked: true, dotColor: primaryColor };
  });
  Object.keys(holidays).forEach(date => {
    markedDates[date] = {
      ...(markedDates[date] || {}),
      dotColor: '#FFC107',
      marked: true,
      customStyles: {
        container: {
          backgroundColor: '#FFFACD',
          borderRadius: 5,
        },
        text: {
          color: '#DAA520',
        },
      },
    };
  });
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: primaryColor,
    selectedTextColor: '#FFFFFF',
    customStyles: {
      ...(markedDates[selectedDate]?.customStyles || {}),
      container: {
        ...(markedDates[selectedDate]?.customStyles?.container || {}),
        backgroundColor: primaryColor,
        borderRadius: 5,
      },
      text: {
        ...(markedDates[selectedDate]?.customStyles?.text || {}),
        color: '#FFFFFF',
      },
    },
  };

  const isSelectedDateHoliday = holidays[selectedDate];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />

      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={24} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={{ width: 60 }} />
      </View>
      <View style={styles.contentContainer}>
        {loading ? (
          <SlotsSkeleton />
        ) : (
          <>
            <Text style={styles.sectionHeader}>Manage Booking Slots</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={onDayPress}
                  markedDates={markedDates}
                  markingType={'custom'}
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

              <View style={styles.holidayToggleContainer}>
                <Text style={styles.holidayToggleText}>
                  {isSelectedDateHoliday
                    ? 'Marked as Holiday'
                    : 'Mark as Holiday'}
                </Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#FFC107' }}
                  thumbColor={isSelectedDateHoliday ? '#F57F17' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleToggleHoliday}
                  value={isSelectedDateHoliday}
                />
              </View>

              <View style={styles.repeatSlotsDailyContainer}>
                <Text style={styles.repeatSlotsDailyText}>
                  Repeat all slots for this day daily (from{' '}
                  {moment(selectedDate).format('MMM Do')})
                </Text>
                <Switch
                  trackColor={{ false: '#767577', true: primaryColor }}
                  thumbColor={repeatSlotsDaily ? primaryColor : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleRepeatSlotsDailyToggle}
                  value={repeatSlotsDaily}
                />
              </View>

              <View style={styles.slotListHeader}>
                <Text style={styles.slotListHeaderText}>
                  Slots for {moment(selectedDate).format('MMMM Do, YYYY')}
                </Text>
                <TouchableOpacity
                  onPress={openAddSlotModal}
                  style={styles.addSlotButton}
                  disabled={isSelectedDateHoliday}
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

              {isSelectedDateHoliday ? (
                <View style={styles.emptySlotsContainer}>
                  <Icon name="weather-sunny-alert" size={40} color="#FFC107" />
                  <Text style={[styles.emptySlotsText, { color: '#DAA520' }]}>
                    This day is marked as a Holiday.
                  </Text>
                  <Text style={styles.emptySlotsSubText}>
                    No bookings can be made for this date.
                  </Text>
                </View>
              ) : (
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
              )}
            </ScrollView>
          </>
        )}
      </View>

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

            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              style={styles.timeInputButton}
            >
              <Text style={styles.timeInputButtonText}>
                Start Time: {moment(startTime).format('HH:mm')}
              </Text>
              <Icon name="clock-outline" size={24} color={primaryColor} />
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onStartTimeChange}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              style={styles.timeInputButton}
            >
              <Text style={styles.timeInputButtonText}>
                End Time: {moment(endTime).format('HH:mm')}
              </Text>
              <Icon name="clock-outline" size={24} color={primaryColor} />
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onEndTimeChange}
              />
            )}

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={repeatUntilModalVisible}
        onRequestClose={() => {
          setRepeatUntilModalVisible(false);
          setRepeatSlotsDaily(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Repeat Slots Until</Text>
            <Calendar
              onDayPress={day => setRepeatUntilDate(day.dateString)}
              markedDates={
                repeatUntilDate
                  ? {
                      [repeatUntilDate]: {
                        selected: true,
                        selectedColor: primaryColor,
                      },
                    }
                  : {}
              }
              minDate={moment(selectedDate).add(1, 'day').format('YYYY-MM-DD')}
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
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setRepeatUntilModalVisible(false);
                  setRepeatSlotsDaily(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleRepeatSlotsConfirm}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
  holidayToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFBE0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFECB3',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  holidayToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DAA520',
  },
  repeatSlotsDailyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  repeatSlotsDailyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#388E3C',
    flexShrink: 1,
    marginRight: 10,
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
  slotItemHoliday: {
    backgroundColor: '#FFF8E1',
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
    borderLeftColor: '#FFC107',
    opacity: 0.8,
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
  timeInputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  timeInputButtonText: {
    fontSize: 16,
    color: '#333',
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
});

export default SlotsManagementScreen;
