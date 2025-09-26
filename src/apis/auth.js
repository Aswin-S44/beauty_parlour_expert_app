import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AVATAR_IMAGE, NO_IMAGE } from '../constants/images';
import axios from 'axios';
import { BACKEND_URL, USER_TYPES } from '../constants/variables';
import { COLLECTIONS } from '../constants/collections';

export const signup = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    const user = userCredential.user;
    await firestore().collection(COLLECTIONS.SHOP_OWNERS).doc(user.uid).set({
      uid: user.uid,
      fullName: '',
      phone: '',
      email,
      createdAt: new Date(),
      parlourName: '',
      about: '',
      address: '',
      isOnboarded: false,
      profileImage: NO_IMAGE,
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
      return results;
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
export const login = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
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
    await auth().signOut();
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const snapshot = await firestore()
      .collection(COLLECTIONS.SHOP_OWNERS)
      .where('email', '==', email)
      .get();

    if (snapshot.empty) {
      return { success: false, message: 'No user found with this email' };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.otp && userData.otp === otp) {
      return {
        success: true,
        message: 'OTP verified successfully',
        userData: userData,
      };
    }

    return { success: false, message: 'Invalid OTP' };
  } catch (error) {
    return {
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    };
  }
};

export const updateShop = async (uid, dataToUpdate) => {
  try {
    await firestore()
      .collection(COLLECTIONS.SHOP_OWNERS)
      .doc(uid)
      .update(dataToUpdate);

    return {
      success: true,
      message: 'Shop updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error updating shop',
      error: error.message,
    };
  }
};

// export const resetPassword = async email => {
//   try {
//     await auth().sendPasswordResetEmail(email);
//     return true;
//   } catch (error) {
//     throw error;
//   }
// };

export const resetPassword = async (email, newPassword) => {
  try {
    // sign in again to reauthenticate (Firebase requires authentication to update password)
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      newPassword,
    );
    const user = userCredential.user;

    await user.updatePassword(newPassword);

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    return { success: false, message: error.message };
  }
};

export const resentOTP = async email => {
  await axios.post(
    `https://beauty-parlor-app-backend.onrender.com/api/v1/user/send-otp`,
    {
      email,
      userType: USER_TYPES.BEAUTY_SHOP,
    },
  );
};
