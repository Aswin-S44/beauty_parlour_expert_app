import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import Reviews from '../../components/Reviews/Reviews';

const ParlourDetails = ({ route, navigation }) => {
  const { parlourData } = route.params;
  const [activeTab, setActiveTab] = React.useState('About');
  console.log('================');
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={parlourData.image} style={styles.image} />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>{parlourData.serviceName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{parlourData.rating}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={16} color="#fff" />
              <Text style={styles.locationText}>{parlourData.location}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('AppointmentScreen')}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'About' && styles.activeTab]}
          onPress={() => setActiveTab('About')}
        >
          <Text style={styles.tabText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Service' && styles.activeTab]}
          onPress={() => setActiveTab('Service')}
        >
          <Text style={styles.tabText}>Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Gallery' && styles.activeTab]}
          onPress={() => setActiveTab('Gallery')}
        >
          <Text style={styles.tabText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Review' && styles.activeTab]}
          onPress={() => setActiveTab('Review')}
        >
          <Text style={styles.tabText}>Review</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'About' && (
        <View style={styles.content}>
          <Text style={styles.subtitle}>Why Choose Us</Text>
          <Text style={styles.description}>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC.
          </Text>
          <View style={styles.bulletPoint}>
            <Icon
              name="circle"
              size={8}
              color="#000"
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletText}>
              Distracted by the readable content of a page when looking at its
              layout.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Icon
              name="circle"
              size={8}
              color="#000"
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletText}>
              Distracted by the readable content of a page when looking at its
              layout.
            </Text>
          </View>

          <Text style={styles.subtitle}>Our Mission and Vision</Text>
          <Text style={styles.description}>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC.
          </Text>
          <View style={styles.bulletPoint}>
            <Icon
              name="circle"
              size={8}
              color="#000"
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletText}>
              Distracted by the readable content of a page when looking at its
              layout.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Icon
              name="circle"
              size={8}
              color="#000"
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletText}>
              Distracted by the readable content of a page when looking at its
              layout.
            </Text>
          </View>
        </View>
      )}
      {console.log('active tab : ', activeTab)}
      {activeTab === 'Service' && (
        <View style={styles.content}>
          {/* {parlourData.services?.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceName}>hello aswins</Text>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))} */}
          <Text>helloaswins</Text>
        </View>
      )}

      {activeTab === 'Review' && (
        <View>
          <Reviews />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 5,
  },
  bulletText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceName: {
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    position: 'absolute',
    bottom: 20,
    left: 200,
    right: 20,
    backgroundColor: primaryColor,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    width: '100',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ParlourDetails;
