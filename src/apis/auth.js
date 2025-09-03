import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { AVATAR_IMAGE } from '../constants/images';
import axios from 'axios';
import { BACKEND_URL, USER_TYPES } from '../constants/variables';

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Storing data into firestore
    const user = userCredential.user;
    await setDoc(doc(db, 'shop-owners', user.uid), {
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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
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
    const q = query(collection(db, 'shop-owners'), where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: 'No user found with this email' };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.otp && userData.otp === otp) {
      // Update with only the fields that need to change
      // await updateDoc(userDoc.ref, {
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
    const shopRef = doc(db, 'shop-owners', uid);

    await updateDoc(shopRef, dataToUpdate);

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
