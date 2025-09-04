// authService.js or wherever your auth functions are
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth'; // Changed from 'firebase/auth'
import { AVATAR_IMAGE } from '../constants/images';
import axios from 'axios';
import { BACKEND_URL, USER_TYPES } from '../constants/variables';
import { auth, firestore } from '../config/firebase';

// Note: firestore() returns the firestore instance, no need for getFirestore()

import { auth as firebaseAuth } from '../config/firebase';

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Storing data into firestore
    const user = userCredential.user;
    await firestore().collection('shop-owners').doc(user.uid).set({
      uid: user.uid,
      fullName: '',
      phone: '',
      email,
      createdAt: new Date(),
      parlourName: '',
      about: '',
      address: '',
      isOnboarded: false,
      profileImage: AVATAR_IMAGE,
      isOTPVerified: false,
      accountInitiated: true,
      profileCompleted: false,
    });

    Promise.allSettled([
      axios.post(BACKEND_URL + `/send-otp`, {
        email,
        userType: USER_TYPES.BEAUTY_SHOP,
      }),
    ]).then(results => {
      console.log('OTP request finished', results);
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    // React Native Firebase uses different syntax
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );

    console.log('userCredential----------', userCredential);
    return userCredential.user;
  } catch (error) {
    console.log('ERROR--------------', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const snapshot = await firestore()
      .collection('shop-owners')
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      return { success: false, message: 'No user found with this email' };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.otp && userData.otp === otp) {
      // Update with only the fields that need to change
      // await userDoc.ref.update({
      //   isOTPVerified: true,
      //   otp: '',
      // });

      return {
        success: true,
        message: 'OTP verified successfully',
        userData: userData,
      };
    }

    return { success: false, message: 'Invalid OTP' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    };
  }
};

export const updateShop = async (uid, dataToUpdate) => {
  try {
    await firestore().collection('shop-owners').doc(uid).update(dataToUpdate);

    return {
      success: true,
      message: 'Shop updated successfully',
    };
  } catch (error) {
    console.error('Error updating shop:', error);
    return {
      success: false,
      message: 'Error updating shop',
      error: error.message,
    };
  }
};
