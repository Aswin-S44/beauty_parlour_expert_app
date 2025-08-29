import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import { getOffersByShop } from '../../apis/services';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton/ServiceCardSkeleton';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { formatFirestoreTimestamp } from '../../utils/utils';

const offersData = [
  {
    id: '1',
    name: 'Facial Makup',
    added: 'Added 2month ago',
    imageUrl: 'https://i.imgur.com/2wDG5I4.png',
  },
  {
    id: '2',
    name: 'Hair Treatment',
    added: 'Added 2month ago',
    imageUrl: 'https://i.imgur.com/xgA31iK.png',
  },
  {
    id: '3',
    name: 'Style Hair Cut',
    added: 'Added 3month ago',
    imageUrl: 'https://i.imgur.com/VPROSjQ.png',
  },
  {
    id: '4',
    name: 'Body Messages & Spa',
    added: 'Added 5month ago',
    imageUrl: 'https://i.imgur.com/g8u2mVI.png',
  },
];

const AllOffersScreen = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.uid) {
      const fetchOffers = async () => {
        try {
          setOffersLoading(true);
          const res = await getOffersByShop(user.uid);
          setOffersLoading(false);
          console.log('offers:', offers);
          if (res && res.length > 0) {
            setOffers(res);
          }
        } catch (err) {
          console.error('Error fetching offers:', err);
        } finally {
          setOffersLoading(false);
        }
      };

      fetchOffers();
    }
  }, [user]);

  const RenderOfferItem = ({ item }) => (
    <View style={styles.card}>
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
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );

  const OfferItem = ({ item, shopId }) => {
    const navigation = useNavigation();
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri:
              typeof item.service.imageUrl === 'string'
                ? item.service.imageUrl
                : NO_IMAGE,
          }}
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.serviceName}</Text>

          <OfferText regularPrice={500} offerPrice={450} />
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            item.active ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() =>
            navigation.navigate('BookingScreen', {
              shopId: shopId,
              serviceId: item.serviceId,
            })
          }
        >
          <Text
            style={[
              styles.bookButtonText,
              item.active ? styles.activeButtonText : styles.inactiveButtonText,
            ]}
          >
            Book
          </Text>
        </TouchableOpacity>
      </View>
    );
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
              renderItem={({ item }) => (
                // <OfferItem item={item} shopId={user.uid} />
                <RenderOfferItem item={item} />
              )}
              // renderItem={renderOfferItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
        {/* <FlatList
          data={offersData}
          renderItem={renderOfferItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        /> */}
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
});

export default AllOffersScreen;
