import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { firestore } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const setupUserDataListener = firebaseUser => {
    if (firebaseUser) {
      setIsEmailVerified(firebaseUser.emailVerified);
      const docRef = firestore()
        .collection(COLLECTIONS.SHOP_OWNERS)
        .doc(firebaseUser.uid);

      const unsubscribe = docRef.onSnapshot(
        docSnap => {
          if (docSnap.exists) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        },
        error => {
          console.error('Error fetching user data in real-time:', error);
          setUserData(null);
          setIsEmailVerified(false);
        },
      );
      return unsubscribe;
    } else {
      setUserData(null);
      setIsEmailVerified(false);
      return () => {};
    }
  };

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeFirestore = () => {};

    unsubscribeAuth = auth().onAuthStateChanged(async firebaseUser => {
      setUser(firebaseUser);
      setLoading(true);

      unsubscribeFirestore();

      if (firebaseUser) {
        unsubscribeFirestore = setupUserDataListener(firebaseUser);
      } else {
        setUserData(null);
        setIsEmailVerified(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const logout = () => {
    auth().signOut();
    setUser(null);
    setUserData(null);
    setIsEmailVerified(false);
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        const docSnap = await firestore()
          .collection(COLLECTIONS.SHOP_OWNERS)
          .doc(user.uid)
          .get();
        if (docSnap.exists) {
          setUserData(docSnap.data());
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        logout,
        loading,
        setLoading,
        setUserData,
        refreshUserData,
        isEmailVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
