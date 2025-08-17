import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { primaryColor } from '../../constants/colors';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/home_bg-1.png')}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Jesika Sabrina</Text>
          <Image
            source={require('../../assets/images/home_bg-1.png')}
            style={styles.avatar}
          />
          <Text style={styles.title}>CEO, Beauty Girls Parlour</Text>
          <View style={styles.ratingContainer}>
            <FontAwesomeIcon name="star" size={20} color="#FFD700" />
            <FontAwesomeIcon name="star" size={20} color="#FFD700" />
            <FontAwesomeIcon name="star" size={20} color="#FFD700" />
            <FontAwesomeIcon name="star" size={20} color="#FFD700" />
            <FontAwesomeIcon name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}> 5 (130)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            Aenean leoiqula porttitor eu,consequat vitae eleifend acenimliquam
            lorem ante dapibus in viverra quis feugiat
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <View style={styles.hoursRow}>
            <Text style={styles.sectionText}>Mon - Wed</Text>
            <Text style={styles.sectionText}>8:00 am - 12:00 pm</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.sectionText}>Fri - Sat</Text>
            <Text style={styles.sectionText}>10:00 am - 11:00 pm</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <Icon name="location-sharp" size={20} color={primaryColor} />
              <Text style={styles.addressText}>
                58 Street - al dulha london - USA
              </Text>
            </View>
            <View style={styles.addressRow}>
              <Icon
                name="navigate-circle-outline"
                size={20}
                color={primaryColor}
              />
              <Text style={styles.addressText}>5 KM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
    flexShrink: 1,
  },
});

export default ProfileScreen;
