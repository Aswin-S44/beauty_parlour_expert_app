import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { deleteOffer, getOffersByShop } from '../../apis/services';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton/ServiceCardSkeleton';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { formatFirestoreTimestamp } from '../../utils/utils';

const AllOffersScreen = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [isMenuVisible, setMenuVisible] = React.useState(false);
  const [offersLoading, setOffersLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContext(AuthContext);

  const fetchOffers = useCallback(async () => {
    if (user && user.uid) {
      try {
        setOffersLoading(true);
        const res = await getOffersByShop(user.uid);
        if (res && res.length > 0) {
          setOffers(res);
        } else {
          setOffers([]);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
        setOffers([]);
      } finally {
        setOffersLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOffers();
    setRefreshing(false);
  }, [fetchOffers]);

  const openMenu = item => {
    setSelectedOffer(item);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedOffer(null);
  };

  const handleEdit = () => {
    if (selectedOffer) {
      navigation.navigate('EditOffersScreen', { offer: selectedOffer });
    }
    closeMenu();
  };

  const handleDelete = () => {
    if (selectedOffer) {
      setDeleteConfirmationVisible(true);
    }
    setMenuVisible(false);
  };

  const confirmDelete = async () => {
    if (selectedOffer && user && user.uid) {
      await deleteOffer(selectedOffer.id, user.uid);
      setOffers(prev => prev.filter(s => s.id !== selectedOffer.id));
    }
    setDeleteConfirmationVisible(false);
  };

  const RenderOfferItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OfferDetailsScreen', { offer: item })}
    >
      <Image
        source={{ uri: item.service.imageUrl }}
        style={styles.offerImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.offerName}>{item.serviceName}</Text>
        <Text style={styles.offerAdded}>
          {formatFirestoreTimestamp(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => openMenu(item)}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
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

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Offer List</Text>

        <>
          {offersLoading ? (
            <>
              <ServiceCardSkeleton />
            </>
          ) : !offersLoading && offers.length == 0 ? (
            <>
              <EmptyComponent />
            </>
          ) : (
            <FlatList
              data={offers}
              renderItem={({ item }) => <RenderOfferItem item={item} />}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('AddOffersScreen');
          }}
        >
          <Text style={styles.addButtonText}>ADD NEW OFFER +</Text>
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
              Are you sure you want to delete offer ?
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
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  offerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  offerAdded: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
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

export default AllOffersScreen;
