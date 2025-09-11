import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { AVATAR_IMAGE } from '../../constants/images';

const ServiceDetailsScreen = ({ navigation, route }) => {
  const { service } = route.params;
  console.log('service----------', service ? service : 'no service');

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
        <ScrollView>
          <Text style={styles.title}>Service Details</Text>
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Name</Text>
              <Text style={styles.sectionText}>
                {service?.serviceName ?? '_'}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category Name</Text>
              <Text style={styles.sectionText}>{service?.category ?? '_'}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Price</Text>
              <Text style={styles.sectionText}>
                {service?.servicePrice ?? '_'}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Image</Text>
              <Image
                source={{ uri: service.imageUrl ?? AVATAR_IMAGE }}
                style={styles.serviceImage}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 150,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.5)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 120,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 30,
  },
  editIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
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
  section: {
    marginTop: 10,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  serviceImage: {
    width: '100%',
    height: '250',
    borderRadius: 8,
  },
});

export default ServiceDetailsScreen;
