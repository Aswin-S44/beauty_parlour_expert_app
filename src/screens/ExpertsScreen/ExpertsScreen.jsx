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

const expertsData = [
  {
    id: '1',
    name: 'Jesika Sona',
    specialty: 'Spa & Skin Specialist',
    added: 'Added 2month ago',
    imageUrl: 'https://i.imgur.com/S5ai1Jg.png',
  },
  {
    id: '2',
    name: 'Fariya Khan',
    specialty: 'Skin Specialist',
    added: 'Added 3month ago',
    imageUrl: 'https://i.imgur.com/i4j1k7G.png',
  },
  {
    id: '3',
    name: 'Lusiya Buma',
    specialty: 'Hair Cut Specialist',
    added: 'Added 4month ago',
    imageUrl: 'https://i.imgur.com/gDaIp0D.png',
  },
  {
    id: '4',
    name: 'Jesika Sona',
    specialty: 'Skin Specialist',
    added: 'Added 6month ago',
    imageUrl: 'https://i.imgur.com/6t4k2j6.png',
  },
];

const ExpertsScreen = ({ navigation }) => {
  const renderExpertItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.expertName}>{item.name}</Text>
        <Text style={styles.expertSpecialty}>{item.specialty}</Text>
        <Text style={styles.expertAdded}>{item.added}</Text>
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
        <Text style={styles.title}>Expert List</Text>
        <FlatList
          data={expertsData}
          renderItem={renderExpertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpertScreeen')}
        >
          <Text style={styles.addButtonText}>ADD NEW BEAUTY EXPERT +</Text>
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
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expertSpecialty: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  expertAdded: {
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

export default ExpertsScreen;
