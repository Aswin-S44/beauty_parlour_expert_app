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
} from 'react-native';
import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { addServices } from '../../apis/services';
import { AuthContext } from '../../context/AuthContext';

const AddServicesScreen = () => {
  const [category, setCategory] = useState('Hair Cut');
  const [serviceName, setServiceName] = useState('Style Hair Cut');
  const [servicePrice, setServicePrice] = useState('25');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const { user, loading } = useContext(AuthContext);

  const predefinedCategories = ['Hair Cut', 'Hair Color', 'Facial', 'Makeup'];

  const handleSaveService = async () => {
    if (!serviceName || !servicePrice || !category) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    const serviceData = {
      category,
      serviceName,
      servicePrice: parseFloat(servicePrice),
    };
    console.log('serviceData----------', serviceData);
    console.log('imageUri-------------', imageUri);

    const result = await addServices(user.uid, serviceData, imageUri); // Replace 'your-shop-id' with the actual shop ID
    if (result) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCategory('');
    setServiceName('');
    setServicePrice('');
    setImageUri(null);
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() !== '') {
      setCategory(customCategory);
    }
    setCategoryModalVisible(false);
    setCustomCategory('');
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        setImageUri(uri);
      }
    });
  };

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

      <Modal
        transparent={true}
        visible={isCategoryModalVisible}
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Add Custom Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter custom category"
              value={customCategory}
              onChangeText={setCustomCategory}
            />
            <TouchableOpacity
              style={styles.okButton}
              onPress={handleAddCustomCategory}
            >
              <Text style={styles.okButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Service</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Categories</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={{ flex: 1 }}
              onValueChange={itemValue => {
                if (itemValue === 'add_custom') {
                  setCategoryModalVisible(true);
                } else {
                  setCategory(itemValue);
                }
              }}
            >
              {predefinedCategories.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
              <Picker.Item label="Add Custom Category" value="add_custom" />
            </Picker>
          </View>

          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            value={serviceName}
            onChangeText={setServiceName}
          />

          <Text style={styles.label}>Service Price</Text>
          <TextInput
            style={styles.input}
            value={servicePrice}
            onChangeText={setServicePrice}
            keyboardType="numeric"
          />

          <View style={styles.uploadLabelContainer}>
            <Text style={styles.label}>Upload Image</Text>
            <Text style={styles.subLabel}>(Mix image size 80x80)</Text>
          </View>
          <TouchableOpacity style={styles.uploadBox} onPress={selectImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <Icon name="image-outline" size={40} color="#ccc" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveService}>
          <Text style={styles.saveButtonText}>SAVE SERVICE +</Text>
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
    fontWeight: 'bold',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  uploadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
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
    marginBottom: 30,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
});

export default AddServicesScreen;
