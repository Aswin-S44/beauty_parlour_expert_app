import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { addServices } from '../../apis/services';
import { AuthContext } from '../../context/AuthContext';

const AddServicesScreen = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user } = useContext(AuthContext);

  const [predefinedCategories, setPredefinedCategories] = useState([
    'Hair Cut',
    'Hair Color',
    'Facial',
    'Makeup',
  ]);

  const validate = () => {
    const newErrors = {};
    if (!category.trim()) newErrors.category = 'Category is required.';
    if (!serviceName.trim())
      newErrors.serviceName = 'Service name is required.';
    if (!servicePrice.trim()) {
      newErrors.servicePrice = 'Service price is required.';
    } else if (isNaN(servicePrice)) {
      newErrors.servicePrice = 'Price must be a valid number.';
    }
    if (!imageUri) newErrors.image = 'An image is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveService = async () => {
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    try {
      const serviceData = {
        category,
        serviceName,
        servicePrice: parseFloat(servicePrice),
      };

      const result = await addServices(user.uid, serviceData, imageUri);
      if (result) {
        setSuccessModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setCategory('');
    setServiceName('');
    setServicePrice('');
    setImageUri(null);
    setErrors({});
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('ImagePicker Error', response.errorMessage);
        return;
      }
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        setImageUri(uri);
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: null }));
        }
      }
    });
  };

  const handleAddCustomCategory = () => {
    const newCategory = customCategory.trim();
    if (newCategory) {
      if (!predefinedCategories.includes(newCategory)) {
        setPredefinedCategories(prev => [newCategory, ...prev]);
      }
      setCategory(newCategory);
      setCategoryModalVisible(false);
      setCustomCategory('');
      if (errors.category) {
        setErrors(prev => ({ ...prev, category: null }));
      }
    } else {
      Alert.alert('Invalid Category', 'Category name cannot be empty.');
    }
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

      <Modal
        transparent={true}
        visible={isSuccessModalVisible}
        animationType="fade"
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <View style={styles.successIconContainer}>
              <Icon name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.modalText}>
              Successfully Added{'\n'}Your New Service
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={handleCloseSuccessModal}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isCategoryModalVisible}
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter category name"
              value={customCategory}
              onChangeText={setCustomCategory}
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddCustomCategory}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Service</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={itemValue => {
                if (itemValue === 'add_new') {
                  setCategoryModalVisible(true);
                } else if (itemValue) {
                  setCategory(itemValue);
                  if (errors.category) {
                    setErrors(prev => ({ ...prev, category: null }));
                  }
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a category..." value="" />
              {predefinedCategories.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
              <Picker.Item
                label="Add a new category..."
                value="add_new"
                style={styles.addNewPickerItem}
              />
            </Picker>
          </View>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}

          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            value={serviceName}
            onChangeText={text => {
              setServiceName(text);
              if (errors.serviceName) {
                setErrors(prev => ({ ...prev, serviceName: null }));
              }
            }}
          />
          {errors.serviceName && (
            <Text style={styles.errorText}>{errors.serviceName}</Text>
          )}

          <Text style={styles.label}>Service Price</Text>
          <TextInput
            style={styles.input}
            value={servicePrice}
            onChangeText={text => {
              setServicePrice(text);
              if (errors.servicePrice) {
                setErrors(prev => ({ ...prev, servicePrice: null }));
              }
            }}
            keyboardType="numeric"
          />
          {errors.servicePrice && (
            <Text style={styles.errorText}>{errors.servicePrice}</Text>
          )}

          <View style={styles.uploadLabelContainer}>
            <Text style={styles.label}>Upload Image</Text>
            <Text style={styles.subLabel}>(Max image size 80x80)</Text>
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
          onPress={handleSaveService}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE SERVICE +</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 5,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addNewPickerItem: {
    color: '#8e44ad',
    backgroundColor: '#f0f0f0',
  },
  uploadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  subLabel: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  uploadBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginTop: 8,
    marginBottom: 5,
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
  saveButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 30,
  },
  disabledButton: {
    backgroundColor: '#c7a4d6',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    width: '85%',
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
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
  },
  addButton: {
    backgroundColor: '#8e44ad',
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddServicesScreen;
