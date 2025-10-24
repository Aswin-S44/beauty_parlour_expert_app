import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../context/AuthContext';
import { getUserData, updateUserData } from '../../apis/services';
import DateTimePicker from '@react-native-community/datetimepicker';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const EditProfileScreen = ({ navigation }) => {
  const { user, refreshUserData } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState([]);
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const initialImage = require('../../assets/images/home_bg-1.png');

  useEffect(() => {
    if (user && user.uid) {
      setProfileLoading(true);
      const fetchUserData = async () => {
        try {
          const res = await getUserData(user.uid);
          if (res) {
            setName(res.parlourName || '');
            setAbout(res.about || '');
            setAddress(res.address || '');
            setImageUri(res.profileImage || null);
            setOpeningHours(res.openingHours || []);
            setGoogleReviewUrl(res.googleReviewUrl || '');
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchUserData();
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const selectImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      response => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else {
          const asset = response.assets?.[0];
          if (asset && asset.base64) {
            const uri = `data:${asset.type};base64,${asset.base64}`;
            setImageUri(uri);
          }
        }
      },
    );
  };

  const toggleDaySelection = day => {
    setSelectedDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day],
    );
  };

  const onTimeChange = (event, selectedDate, type) => {
    if (type === 'start') {
      setShowStartTimePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setStartTime(selectedDate);
      }
    } else {
      setShowEndTimePicker(Platform.OS === 'ios');
      if (selectedDate) {
        setEndTime(selectedDate);
      }
    }
  };

  const formatTime = date => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addOpeningHour = () => {
    if (selectedDays.length === 0) {
      setToastMessage('Please select at least one day.');
      return;
    }

    const sortedDays = selectedDays.sort(
      (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b),
    );

    let displayDays;
    if (sortedDays.length === daysOfWeek.length) {
      displayDays = 'Everyday';
    } else if (sortedDays.length === 1) {
      displayDays = sortedDays[0];
    } else {
      const startDayIndex = daysOfWeek.indexOf(sortedDays[0]);
      const endDayIndex = daysOfWeek.indexOf(sortedDays[sortedDays.length - 1]);
      let isConsecutive = true;
      for (let i = 1; i < sortedDays.length; i++) {
        if (
          daysOfWeek.indexOf(sortedDays[i]) !==
          daysOfWeek.indexOf(sortedDays[i - 1]) + 1
        ) {
          isConsecutive = false;
          break;
        }
      }

      if (isConsecutive) {
        displayDays = `${sortedDays[0].substring(0, 3)} - ${sortedDays[
          sortedDays.length - 1
        ].substring(0, 3)}`;
      } else {
        displayDays = sortedDays.map(day => day.substring(0, 3)).join(', ');
      }
    }

    const newHourString = `${displayDays}: ${formatTime(
      startTime,
    )} - ${formatTime(endTime)}`;

    if (!openingHours.includes(newHourString)) {
      setOpeningHours([...openingHours, newHourString]);
      setIsModalVisible(false);
      setSelectedDays([]);
      setStartTime(new Date());
      setEndTime(new Date());
    } else {
      setToastMessage('This opening hour entry already exists.');
    }
  };

  const removeOpeningHour = hourToRemove => {
    setOpeningHours(openingHours.filter(hour => hour !== hourToRemove));
  };

  const handleEditProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    const updatedData = {
      parlourName: name,
      address: address,
      profileImage: imageUri,
      about: about,
      openingHours: openingHours,
      googleReviewUrl: googleReviewUrl,
    };
    try {
      await updateUserData(user.uid, updatedData);
      await refreshUserData();
      setToastMessage('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      setToastMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const imageSource = imageUri ? { uri: imageUri } : initialImage;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} disabled={isSaving}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editImageIcon}
              onPress={selectImage}
            >
              <Icon name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Parlour Name"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={about}
              onChangeText={setAbout}
              placeholder="Tell us about your parlour"
              multiline
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Your Address"
              multiline
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Opening Hours</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              style={styles.addHourButtonStyled}
            >
              <Text style={styles.addHourButtonText}>Add Opening Hours</Text>
              <Icon name="add-circle" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.hourChipsContainer}>
              {openingHours.map((hour, index) => (
                <View key={index} style={styles.hourChip}>
                  <Text style={styles.hourChipText}>{hour}</Text>
                  <TouchableOpacity
                    onPress={() => removeOpeningHour(hour)}
                    style={styles.removeHourButton}
                  >
                    <Icon name="close-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Google Review URL</Text>
            <TextInput
              style={styles.input}
              value={googleReviewUrl}
              onChangeText={setGoogleReviewUrl}
              placeholder="Enter Google Review URL"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Days and Time</Text>

            <View style={styles.daySelectionContainer}>
              {daysOfWeek.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    selectedDays.includes(day) && styles.selectedDayChip,
                  ]}
                  onPress={() => toggleDaySelection(day)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      selectedDays.includes(day) && styles.selectedDayChipText,
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timePickerRow}>
              <Text style={styles.timePickerLabel}>Starts:</Text>
              <TouchableOpacity
                onPress={() => setShowStartTimePicker(true)}
                style={styles.timeDisplayButton}
              >
                <Text style={styles.timeDisplayText}>
                  {formatTime(startTime)}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timePickerLabel}>Ends:</Text>
              <TouchableOpacity
                onPress={() => setShowEndTimePicker(true)}
                style={styles.timeDisplayButton}
              >
                <Text style={styles.timeDisplayText}>
                  {formatTime(endTime)}
                </Text>
              </TouchableOpacity>
            </View>

            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) =>
                  onTimeChange(event, selectedDate, 'start')
                }
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) =>
                  onTimeChange(event, selectedDate, 'end')
                }
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={addOpeningHour}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {(profileLoading || isSaving) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.loadingText}>
            {isSaving ? 'Saving...' : 'Loading...'}
          </Text>
        </View>
      )}

      {toastMessage ? (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
  },
  editImageIcon: {
    position: 'absolute',
    bottom: 5,
    right: '32%',
    backgroundColor: primaryColor,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addHourButtonStyled: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addHourButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  hourChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hourChip: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  hourChipText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  removeHourButton: {
    marginLeft: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  daySelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dayChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDayChip: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  dayChipText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDayChipText: {
    color: '#fff',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  timePickerLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    marginRight: 5,
  },
  timeDisplayButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  timeDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveModalButton: {
    backgroundColor: primaryColor,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
