import React, { useEffect } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth, {
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';
import { primaryColor } from '../../constants/colors';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { COLLECTIONS } from '../../constants/collections';
import { generateRandomName } from '../../utils/utils';
import { GOOGLE_ICON, NO_IMAGE } from '../../constants/images';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const WelcomeScreen = ({ navigation }) => {
  const lighterPrimaryColor = '#FBCDFF';

  const { user, refreshUser, userData } = useContext(AuthContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: false,
    });
  }, []);

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in
      const signInResult = await GoogleSignin.signIn();

      let idToken = signInResult.data?.idToken || signInResult.idToken;
      const user = signInResult.data?.user;

      if (!idToken) throw new Error('No ID token found');

      if (!idToken) {
        Alert.alert('Error', 'Error while signin');
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const firebaseUser = userCredential.user;
      console.log(
        'firebaseUser------------------',
        firebaseUser ? firebaseUser : 'no firebaseUser',
      );
      const shopRef = firestore()
        .collection(COLLECTIONS.SHOP_OWNERS)
        .doc(firebaseUser.uid);
      const docSnap = await shopRef.get();

      // if (firebaseUser) {
      //   const snapshot = await firestore()
      //   .collection(COLLECTIONS.SHOP_OWNERS)
      //   .where('email', '==', firebaseUser.email)
      //   .get();
      // }

      let updateData = {
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || generateRandomName(),
        phone: '',
        email: firebaseUser.email,
        createdAt: new Date(),
        parlourName: '',
        about: '',
        address: '',
        isOnboarded: false,
        profileImage: NO_IMAGE,
        isOTPVerified: false,
        accountInitiated: true,
        profileCompleted: false,
        emailVerified: true,
        openingHours: [],
      };

      if (docSnap.exists) {
        console.log('1111111111111111');
        console.log(
          ' docSnap.data.isOnboarded===============',
          docSnap.data.isOnboarded
            ? docSnap.data.isOnboarded
            : 'no  docSnap.data.isOnboarded',
        );
        await shopRef.set({
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || generateRandomName(),
          phone: '',
          email: firebaseUser.email,
          createdAt: new Date(),
          parlourName: '',
          about: '',
          address: '',
          isOnboarded: true, // docSnap.data.isOnboarded,
          profileImage: NO_IMAGE,
          isOTPVerified: true,
          accountInitiated: true,
          profileCompleted: true,
          emailVerified: true,
          openingHours: [],
        });
      } else {
        console.log('22222222222222222');
        await firestore()
          .collection(COLLECTIONS.SHOP_OWNERS)
          .doc(firebaseUser.uid)
          .set(updateData);
      }

      let res = await signInWithCredential(getAuth(), googleCredential);

      return firebaseUser;
    } catch (error) {
      console.log('GOOGLE SIGN-IN ERROR =====>', error);
    }
  }

  return (
    <LinearGradient
      colors={[primaryColor, lighterPrimaryColor]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      <Image
        source={require('../../assets/images/splash_logo.png')}
        style={styles.welcomeImage}
      />
      <Text style={styles.title}>Beauty Expert App</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        >
          <Image source={{ uri: GOOGLE_ICON }} style={styles.googleIcon} />
          <Text style={styles.signInButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleIcon: {
    marginRight: 10,
    // color: 'darkcyan',
  },
  signInButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    paddingVertical: 15,
    width: '90%',
    alignItems: 'center',
    borderRadius: 12,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});

export default WelcomeScreen;
