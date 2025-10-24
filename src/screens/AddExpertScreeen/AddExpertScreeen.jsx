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
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../../context/AuthContext';
import { addBeautyExpert } from '../../apis/services';

const AddExpertScreen = ({ navigation }) => {
  const [expertName, setExpertName] = useState('');
  const [specialist, setSpecialist] = useState(null);
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [specialistOptions, setSpecialistOptions] = useState([
    { label: 'Hair Cut', value: 'hair_cut' },
    { label: 'Hair Styling', value: 'hair_styling' },
    { label: 'Hair Coloring', value: 'hair_coloring' },
    { label: 'Facial', value: 'facial' },
    { label: 'Manicure', value: 'manicure' },
    { label: 'Pedicure', value: 'pedicure' },
    { label: 'Makeup', value: 'makeup' },
    { label: 'Bridal Makeup', value: 'bridal_makeup' },
    { label: 'Waxing', value: 'waxing' },
    { label: 'Threading', value: 'threading' },
    { label: 'Spa Treatment', value: 'spa' },
    { label: 'Massage', value: 'massage' },
    { label: 'Skin Treatment', value: 'skin_treatment' },
    { label: 'Nail Art', value: 'nail_art' },
  ]);

  const validate = () => {
    const newErrors = {};
    if (!expertName.trim()) newErrors.expertName = 'Expert name is required.';
    if (!specialist) newErrors.specialist = 'A specialty is required.';
    if (!address.trim()) newErrors.address = 'Address is required.';
    if (!imageUri) newErrors.image = 'An image is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
          if (errors.image) {
            setErrors(prev => ({ ...prev, image: null }));
          }
        }
      }
    });
  };

  const handleAddBeautyExpert = async () => {
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    try {
      const expertData = {
        expertName,
        specialist,
        about,
        address,
      };
      const result = await addBeautyExpert(user.uid, expertData, imageUri);
      if (result) {
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add expert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setExpertName('');
    setSpecialist(null);
    setAbout('');
    setAddress('');
    setImageUri(null);
    setErrors({});
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/home_bg-1.png')}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Beauty Expert</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Expert Name</Text>
          <TextInput
            style={styles.input}
            value={expertName}
            onChangeText={text => {
              setExpertName(text);
              if (errors.expertName)
                setErrors(prev => ({ ...prev, expertName: null }));
            }}
          />
          {errors.expertName && (
            <Text style={styles.errorText}>{errors.expertName}</Text>
          )}

          <Text style={styles.label}>Specialist</Text>
          <DropDownPicker
            open={open}
            value={specialist}
            items={specialistOptions}
            setOpen={setOpen}
            setValue={setSpecialist}
            onSelectItem={() => {
              if (errors.specialist)
                setErrors(prev => ({ ...prev, specialist: null }));
            }}
            setItems={setSpecialistOptions}
            searchable={true}
            addCustomItem={true}
            placeholder="Select or search for a specialist"
            searchPlaceholder="Search..."
            style={[styles.pickerStyle, open && { borderColor: '#8e44ad' }]}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.pickerText}
            selectedItemLabelStyle={styles.selectedItemLabel}
            listItemLabelStyle={styles.listItemLabel}
            tickIconStyle={styles.tickIcon}
            arrowIconStyle={styles.arrowIcon}
            searchContainerStyle={styles.searchContainer}
            searchTextInputStyle={styles.searchTextInput}
            searchPlaceholderTextColor="#999"
            zIndex={3000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />
          {errors.specialist && (
            <Text style={styles.errorText}>{errors.specialist}</Text>
          )}

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
            onChangeText={text => {
              setAddress(text);
              if (errors.address)
                setErrors(prev => ({ ...prev, address: null }));
            }}
            multiline
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          <View style={styles.uploadLabelContainer}>
            <Text style={styles.label}>Upload Image</Text>
            <Text style={styles.subLabel}>(Mix image size 90x90)</Text>
          </View>
          <TouchableOpacity style={styles.uploadBox} onPress={selectImage}>
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.uploadedImage}
                />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => setImageUri(null)}
                >
                  <Icon name="close-circle" size={24} color="#333" />
                </TouchableOpacity>
              </>
            ) : (
              <Icon name="image-outline" size={40} color="#ccc" />
            )}
          </TouchableOpacity>
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleAddBeautyExpert}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>ADD EXPERT +</Text>
          )}
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
              Successfully Added{'\n'}New Beauty Expert
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
  pickerStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  dropDownContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  selectedItemLabel: {
    fontWeight: 'bold',
    color: '#8e44ad',
  },
  listItemLabel: {
    color: '#555',
  },
  tickIcon: {
    tintColor: '#8e44ad',
  },
  arrowIcon: {
    tintColor: '#8e44ad',
  },
  searchContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  searchTextInput: {
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
    backgroundColor: '#fff',
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
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 30,
    marginTop: 25,
  },
  disabledButton: {
    backgroundColor: '#c7a4d6',
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
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8e44ad',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
  },
});

export default AddExpertScreen;
