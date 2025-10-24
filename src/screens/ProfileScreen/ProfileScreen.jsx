import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { primaryColor } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { AVATAR_IMAGE } from '../../constants/images';
import StarRating from '../../components/StarRating/StarRating';

const ProfileScreen = ({ navigation }) => {
  const { userData } = useContext(AuthContext);

  const handleOpenGoogleReview = () => {
    if (userData?.googleReviewUrl) {
      Linking.openURL(userData?.googleReviewUrl).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
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
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileInfo}>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <FontAwesomeIcon name="pencil" size={22} color={primaryColor} />
          </TouchableOpacity>
          <Text style={styles.name}>{userData?.parlourName ?? '_'}</Text>
          <Image
            source={{ uri: userData?.profileImage ?? AVATAR_IMAGE }}
            style={styles.avatar}
          />

          <View style={styles.ratingContainer}>
            <StarRating rating={userData?.totalRating ?? 0} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            {userData?.about?.trim() == '' ? 'Not added' : userData?.about}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <View style={styles.hoursRow}>
            {userData?.openingHours?.length === 0 ? (
              <Text>Not added</Text>
            ) : (
              userData?.openingHours?.map((hour, index) => (
                <View key={index} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.sectionText}>{hour}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <Icon name="location-sharp" size={20} color={primaryColor} />
              <Text style={styles.addressText}>{userData?.address ?? ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TouchableOpacity
            onPress={handleOpenGoogleReview}
            style={styles.reviewButton}
          >
            <FontAwesomeIcon name="google" size={20} color="#DB4437" />
            {!userData?.googleReviewUrl ? (
              <Text style={styles.reviewButtonText}>Not added</Text>
            ) : (
              <Text style={styles.reviewButtonText}>Google Review</Text>
            )}
          </TouchableOpacity>
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
  editIcon: {
    position: 'absolute',
    top: 0,
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
    color: '#888',
    lineHeight: 22,
  },
  hoursRow: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  bullet: {
    marginRight: 6,
    fontSize: 20,
    color: primaryColor,
  },
  sectionText: {
    fontSize: 16,
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
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 5,
  },
  reviewButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

export default ProfileScreen;
