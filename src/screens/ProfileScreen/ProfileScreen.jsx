import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { primaryColor } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { getUserData } from '../../apis/services';
import { AVATAR_IMAGE } from '../../constants/images';
import StarRating from '../../components/StarRating/StarRating';

const ProfileScreen = ({ navigation }) => {
  const { user, refreshUserData } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const [openingHoursMonWed, setOpeningHoursMonWed] = useState('');
  const [openingHoursFriSat, setOpeningHoursFriSat] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const initialImage = AVATAR_IMAGE;
  const [openingHours, setOpeningHours] = useState([]);
  const [totalRating, setTotalRating] = useState(0);

  const imageSource = imageUri ? { uri: imageUri } : initialImage;

  const fetchUserData = useCallback(async () => {
    if (user && user.uid) {
      setProfileLoading(true);
      try {
        const res = await getUserData(user.uid);
        console.log('');
        if (res) {
          setName(res.parlourName || '');
          setAbout(res.about || '');
          setAddress(res.address || '');
          setImageUri(res.profileImage || null);

          setGoogleReviewUrl(res.googleReviewUrl || 'Not added');
          setOpeningHours(res.openingHours);
          setTotalRating(res.totalRating);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setProfileLoading(false);
      }
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
    await refreshUserData();
  }, [fetchUserData, refreshUserData]);

  const handleOpenGoogleReview = () => {
    if (googleReviewUrl) {
      Linking.openURL(googleReviewUrl).catch(err =>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileInfo}>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <FontAwesomeIcon name="pencil" size={22} color={primaryColor} />
          </TouchableOpacity>
          <Text style={styles.name}>{name ?? '_'}</Text>
          <Image source={imageSource} style={styles.avatar} />
          {/* <Text style={styles.title}>CEO, Beauty Girls Parlour</Text> */}
          <View style={styles.ratingContainer}>
            <StarRating rating={totalRating} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>
            {about?.trim() == '' ? 'Not added' : about}
          </Text>
        </View>

        <View style={styles.section}>
          {console.log('OPENING HOURS===========', openingHours)}
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <View style={styles.hoursRow}>
            {openingHours?.length === 0 ? (
              <Text>Not added</Text>
            ) : (
              openingHours?.map((hour, index) => (
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
              <Text style={styles.addressText}>{address ?? ''}</Text>
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
            {!googleReviewUrl ? (
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
