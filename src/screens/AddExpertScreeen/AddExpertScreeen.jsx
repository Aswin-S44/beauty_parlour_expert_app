import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../context/AuthContext';
import { addBeautyExpert } from '../../apis/services';
import { Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const AddExpertScreen = () => {
  const [expertName, setExpertName] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const { user } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        console.log('uri-----------', uri);
        setImageUri(uri);
      }
    });
  };

  const handleAddBeautyExpert = async () => {
    if (!expertName || !specialist || !address) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const expertData = {
      expertName,
      specialist,
      about,
      address,
    };

    const result = await addBeautyExpert(user.uid, expertData, imageUri); // Replace 'your-shop-id' with the actual shop ID
    if (result) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setExpertName('');
    setSpecialist('');
    setAbout('');
    setAddress('');
    setImageUri(null);
  };

  const [specialistOptions, setSpecialistOptions] = useState([
    { label: 'Dr. Stephen Strange', value: 'dr_strange' },
    { label: 'Dr. Bruce Banner', value: 'dr_banner' },
    { label: 'Dr. Henry Pym', value: 'dr_pym' },
    { label: 'Dr. Jane Foster', value: 'dr_foster' },
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.imgur.com/VPROSjQ.png' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Beauty Expert</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Expert Name</Text>
          <TextInput
            style={styles.input}
            value={expertName}
            onChangeText={setExpertName}
          />

          <Text style={styles.label}>Specialist</Text>
          <DropDownPicker
            open={open}
            value={specialist}
            items={specialistOptions}
            setOpen={setOpen}
            setValue={setSpecialist}
            setItems={setSpecialistOptions}
            // --- KEY FEATURES ---
            searchable={true} // Enables the search functionality
            addCustomItem={true} // Allows adding items that are not in the list
            // --- STYLING & PLACEHOLDER ---
            placeholder="Select or search for a specialist"
            searchPlaceholder="Search..."
            style={styles.pickerContainer}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
          />

          <Text style={styles.label}>About</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={about}
            onChangeText={setAbout}
            multiline
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <View style={styles.uploadLabelContainer}>
            <Text style={styles.label}>Upload Image</Text>
            <Text style={styles.subLabel}>(Mix image size 90x90)</Text>
          </View>
          {console.log('imageUri---------', imageUri)}
          <TouchableOpacity style={styles.uploadBox} onPress={selectImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <Icon name="image-outline" size={40} color="#ccc" />
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.uploadBox}>
            <Icon name="image-outline" size={50} color="#ccc" />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddBeautyExpert}
        >
          <Text style={styles.saveButtonText}>ADD EXPERT +</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Icon name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.modalText}>
              Successfully Add{'\n'}Your New Service
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 120,
    justifyContent: 'center',
    paddingTop: 20,
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
    top: 50,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  form: {
    paddingHorizontal: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  uploadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default AddExpertScreen;
