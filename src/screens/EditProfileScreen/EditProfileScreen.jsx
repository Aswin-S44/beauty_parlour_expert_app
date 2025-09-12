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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../context/AuthContext';
import { getUserData, updateUserData } from '../../apis/services';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState(''); // Unified opening hours state
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
            setOpeningHours(res.openingHours || ''); // Load unified opening hours
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

  const handleEditProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    const updatedData = {
      parlourName: name,
      address: address,
      profileImage: imageUri,
      about: about,
      openingHours: openingHours, // Save unified opening hours
      googleReviewUrl: googleReviewUrl,
    };
    try {
      await updateUserData(user.uid, updatedData);
      setToastMessage('Profile updated successfully!');
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
            <TextInput
              style={styles.input}
              value={openingHours}
              onChangeText={setOpeningHours}
              placeholder="e.g., Mon - Sat: 8:00 am - 12:00 pm"
            />
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
});

export default EditProfileScreen;
