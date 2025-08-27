import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { AVATAR_IMAGE } from '../constants/images';

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

