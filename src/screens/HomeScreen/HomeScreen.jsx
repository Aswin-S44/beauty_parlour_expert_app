import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Card from '../../components/Card/Card';

const HomeScreen = ({ navigation }) => {
  const services = [
    {
      id: 1,
      name: 'Hair',
      icon: 'spa',
      image: require('../../assets/images/category/1.png'),
    },
    {
      id: 2,
      name: 'Facial',
      icon: 'smile-o',
      image: require('../../assets/images/category/2.png'),
    },
    {
      id: 3,
      name: 'Makeup',
      icon: 'female',
      image: require('../../assets/images/category/3.png'),
    },
    {
      id: 4,
      name: 'Haircut',
      icon: 'scissors',
      image: require('../../assets/images/category/4.png'),
    },
  ];

  const featuredSection = [
    {
      id: 1,
      serviceName: 'Live Style Parlour',
      image: require('../../assets/images/bg.png'),
      location: 'Captown City',
      rating: 4.0,
      status: 'Open',
    },
    {
      id: 2,
      serviceName: 'Kigfisher Pro',
      image: require('../../assets/images/services/6.png'),
      location: 'Captown City',
      rating: 4.0,
      status: 'Open',
    },
    {
      id: 3,
      serviceName: 'Landon Town',
      image: require('../../assets/images/services/5.png'),
      location: 'Captown City',
      rating: 4.0,
      status: 'Open',
    },
    {
      id: 4,
      serviceName: 'Live Style Parlour',
      image: require('../../assets/images/services/4.png'),
      location: 'Captown City',
      rating: 4.0,
      status: 'Open',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../../images/home_bg.png')}
          style={styles.bannerImage}
        />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Beauty Parlour</Text>
          <Text style={styles.bannerSubtitle}>Beauty Parlour Booking App</Text>
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.servicesContainer}>
            {services.map(service => (
              <View>
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() =>
                    navigation.navigate('Appointment', {
                      service: service.name,
                    })
                  }
                >
                  <Image source={service.image} style={styles.smallImage} />
                </TouchableOpacity>
                <Text style={styles.serviceName}>{service.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Featured Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Services</Text>
        <View style={styles.featuredContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredSection.map((feature, index) => (
              <View>
                <Card
                  image={feature.image}
                  title={feature.serviceName}
                  location={feature.location}
                  rating={feature.rating}
                  status={feature.status}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.featuredContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredSection.map((feature, index) => (
              <View>
                <Card
                  image={feature.image}
                  title={feature.serviceName}
                  location={feature.location}
                  rating={feature.rating}
                  status={feature.status}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const primaryColor = '#E6A3DD'; // Replace with your primary color

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  smallImage: {
    height: 30,
    width: 30,
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // distributes space between cards
    paddingHorizontal: 10, // add some horizontal padding
  },

  serviceCard: {
    width: 72, // fixed width for all cards
    alignItems: 'center',
    marginRight: 10, // spacing between cards
    padding: 10,
    height: 72,
    backgroundColor: primaryColor,
    borderRadius: 50,
    justifyContent: 'center',
  },

  serviceName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    fontWeight: 600,
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  featuredTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featuredPrice: {
    padding: 10,
    paddingTop: 0,
    fontSize: 16,
    color: primaryColor,
  },
});

export default HomeScreen;
