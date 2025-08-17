import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const servicesData = [
  {
    id: '1',
    name: 'Hair Cut',
    added: 'Added 2month ago',
    imageUrl: 'https://i.imgur.com/83m3y55.png',
  },
  {
    id: '2',
    name: 'Fascial',
    added: 'Added 2month ago',
    imageUrl: 'https://i.imgur.com/2wDG5I4.png',
  },
  {
    id: '3',
    name: 'Hair Treatment',
    added: 'Added 3month ago',
    imageUrl: 'https://i.imgur.com/VPROSjQ.png',
  },
  {
    id: '4',
    name: 'Makeup',
    added: 'Added 3month ago',
    imageUrl: 'https://i.imgur.com/39352nB.png',
  },
  {
    id: '5',
    name: 'Spa',
    added: 'Added 5month ago',
    imageUrl: 'https://i.imgur.com/g8u2mVI.png',
  },
];

const AllServicesScreen = ({ navigation }) => {
  const renderServiceItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.cardContent}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceAdded}>{item.added}</Text>
      </View>
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );

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

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Service List</Text>
        <FlatList
          data={servicesData}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddServicesScreen')}
        >
          <Text style={styles.addButtonText}>ADD NEW SERVICE +</Text>
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
    height: 150,
    justifyContent: 'flex-end',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
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
    fontWeight: 'bold',
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

export default AllServicesScreen;
