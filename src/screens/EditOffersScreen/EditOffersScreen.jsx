import React, { useContext, useEffect, useState } from 'react';
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
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import {
  updateOffer,
  getShopServices,
  updateServiceOffer,
} from '../../apis/services';
import { launchImageLibrary } from 'react-native-image-picker';

const EditOffersScreen = ({ navigation, route }) => {
  const { offer } = route.params;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [regularPrice, setRegularPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [servicesForCategory, setServicesForCategory] = useState([]);

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.uid) {
      setLoading(true);
      const fetchServices = async () => {
        try {
          const res = await getShopServices(user.uid);
          const services = res || [];
          setMyServices(services);
          const uniqueCategories = [
            ...new Set(services.map(item => item.category)),
          ];
          setCategories(uniqueCategories);

          if (offer) {
            setSelectedCategory(offer.category);
            setSelectedService({
              id: offer.serviceId,
              serviceName: offer.serviceName,
              servicePrice: offer.regularPrice,
            });
            setRegularPrice(String(offer.regularPrice));
            setOfferPrice(String(offer.offerPrice));
            setImageUri(offer.service.imageUrl || null);

            const filteredServices = services.filter(
              service => service.category === offer.category,
            );
            setServicesForCategory(filteredServices);
          }
        } catch (error) {
          console.error('Failed to fetch services:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    } else {
      setLoading(false);
    }
  }, [user, offer]);

  const handleSelectCategory = category => {
    setSelectedCategory(category);
    const filteredServices = myServices.filter(
      service => service.category === category,
    );
    setServicesForCategory(filteredServices);
    setSelectedService(null);
    setRegularPrice('');
    setOfferPrice('');
    setCategoryModalVisible(false);
  };

  const handleSelectService = service => {
    setSelectedService(service);
    setRegularPrice(String(service.servicePrice));
    setOfferPrice('');
    setServiceModalVisible(false);
  };

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

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    navigation.goBack();
  };

  const handleUpdateOffer = async () => {
    if (!selectedService || !offerPrice || !imageUri) {
      Alert.alert(
        'Missing Information',
        'Please fill all fields and upload an image.',
      );
      return;
    }

    setIsSaving(true);

    const offerData = {
      serviceId: selectedService.id,
      category: selectedCategory,
      serviceName: selectedService.serviceName,
      regularPrice: parseFloat(regularPrice),
      offerPrice: parseFloat(offerPrice),
      imageUrl: imageUri,
    };

    try {
      if (user && user.uid && offer && offer.id) {
        const result = await updateServiceOffer(offer.id, offerData);
        if (result) {
          setSuccessModalVisible(true);
        } else {
          Alert.alert('Error', 'Failed to update the offer. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while updating the offer.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderPickerModal = (
    visible,
    setVisible,
    data,
    onSelectItem,
    keyExtractor,
    renderItem,
  ) => (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setVisible(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelectItem(item)}
              >
                <Text style={styles.modalItemText}>{renderItem(item)}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
      >
        <Text style={styles.title}>Edit Offer</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#8e44ad"
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            <View style={styles.form}>
              <Text style={styles.label}>Categories</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setCategoryModalVisible(true)}
              >
                <Text style={styles.pickerText}>
                  {selectedCategory || 'Select a category'}
                </Text>
                <Icon name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>

              <Text style={styles.label}>Service Name</Text>
              <TouchableOpacity
                style={[
                  styles.pickerContainer,
                  !selectedCategory && styles.disabledPicker,
                ]}
                onPress={() => setServiceModalVisible(true)}
                disabled={!selectedCategory}
              >
                <Text style={styles.pickerText}>
                  {selectedService
                    ? selectedService.serviceName
                    : 'Select a service'}
                </Text>
                <Icon name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>

              <Text style={styles.label}>Regular Price</Text>
              <TextInput
                style={styles.input}
                value={regularPrice}
                onChangeText={setRegularPrice}
                keyboardType="numeric"
                placeholder="Regular price"
              />

              <Text style={styles.label}>Offer Price</Text>
              <TextInput
                style={styles.input}
                value={offerPrice}
                onChangeText={setOfferPrice}
                keyboardType="numeric"
                placeholder="Enter offer price"
              />

              <View style={styles.uploadLabelContainer}>
                <Text style={styles.label}>Upload Image</Text>
                <Text style={styles.subLabel}>(Min image size 90x90)</Text>
              </View>
              <TouchableOpacity style={styles.uploadBox} onPress={selectImage}>
                {imageUri ? (
                  <>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.uploadedImage}
                    />
                  </>
                ) : (
                  <Icon name="image-outline" size={40} color="#ccc" />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleUpdateOffer}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>UPDATE OFFER</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {renderPickerModal(
        isCategoryModalVisible,
        setCategoryModalVisible,
        categories,
        handleSelectCategory,
        (item, index) => index.toString(),
        item => item,
      )}

      {renderPickerModal(
        isServiceModalVisible,
        setServiceModalVisible,
        servicesForCategory,
        handleSelectService,
        item => item.id,
        item => item.serviceName,
      )}

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
              Successfully Updated{'\n'}Your Offer
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
    zIndex: 1,
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
  disabledPicker: {
    backgroundColor: '#f0f0f0',
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
    marginBottom: 20,
    overflow: 'hidden',
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
  saveButtonDisabled: {
    backgroundColor: '#b392c4',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '60%',
    borderRadius: 10,
    padding: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
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
});

export default EditOffersScreen;
