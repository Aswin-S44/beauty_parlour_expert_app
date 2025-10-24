import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteService, getShopServices } from '../../apis/services';
import { AuthContext } from '../../context/AuthContext';
import { formatTimeAgo } from '../../utils/utils';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton/ServiceCardSkeleton';

const AllServicesScreen = ({ navigation }) => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isMenuVisible, setMenuVisible] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState(null);
  const { user } = React.useContext(AuthContext);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchServices = React.useCallback(async () => {
    try {
      setLoading(true);
      if (user) {
        const res = await getShopServices(user.uid);
        setServices(res || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch services.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchServices();
    });

    return unsubscribe;
  }, [navigation, fetchServices]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, [fetchServices]);

  const openMenu = item => {
    setSelectedService(item);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedService(null);
  };

  const handleEdit = () => {
    if (selectedService) {
      navigation.navigate('EditServiceScreen', { service: selectedService });
    }
    closeMenu();
  };

  const handleDelete = () => {
    if (selectedService) {
      setDeleteConfirmationVisible(true);
    }
    setMenuVisible(false);
  };

  const confirmDelete = async () => {
    if (selectedService && user && user.uid) {
      await deleteService(selectedService.id, user.uid);
      setServices(prev => prev.filter(s => s.id !== selectedService.id));
    }
    setDeleteConfirmationVisible(false);
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ServiceDetailsScreen', { service: item })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.cardContent}>
        <Text style={styles.serviceName}>{item.category}</Text>
        <Text style={styles.serviceAdded}>
          {item.createdAt ? formatTimeAgo(item.createdAt) : '_'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => openMenu(item)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../assets/images/no-services.jpg')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No Services Found</Text>
      <Text style={styles.emptySubText}>Add a new service to get started.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8e44ad" />
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

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Service List</Text>
        {loading && !refreshing ? (
          <>
            <ServiceCardSkeleton />
          </>
        ) : (
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddServicesScreen')}
        >
          <Text style={styles.addButtonText}>ADD NEW SERVICE +</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isMenuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={closeMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Icon name="pencil-outline" size={22} color="#555" />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Icon name="trash-outline" size={22} color="#ff3b30" />
              <Text style={[styles.menuItemText, { color: '#ff3b30' }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent={true}
        visible={deleteConfirmationVisible}
        animationType="fade"
        onRequestClose={() => setDeleteConfirmationVisible(false)}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={() => setDeleteConfirmationVisible(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalIconContainer}>
              <Icon name="checkmark-circle" size={60} color="#8e44ad" />
            </View>
            <Text style={styles.modalText}>
              Are you sure you want to delete {selectedService?.serviceName}?
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={confirmDelete}
            >
              <Text style={styles.textStyle}>DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setDeleteConfirmationVisible(false)}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    height: 150,
    backgroundColor: '#8e44ad',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.6)',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
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
  listContainer: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  serviceAdded: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalIconContainer: {
    marginBottom: 15,
    backgroundColor: '#e0c0e0',
    borderRadius: 50,
    padding: 10,
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: '100%',
    marginBottom: 10,
  },
  buttonConfirm: {
    backgroundColor: '#8e44ad',
  },
  buttonCancel: {
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelText: {
    color: '#111',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AllServicesScreen;
