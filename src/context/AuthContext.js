import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { firestore } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async firebaseUser => {
    if (firebaseUser) {
      try {
        const docRef = firestore()
          .collection(COLLECTIONS.SHOP_OWNERS)
          .doc(firebaseUser.uid);

        const unsubscribeSnapshot = docRef.onSnapshot(docSnap => {
          if (docSnap.exists) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        });

        return unsubscribeSnapshot;
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserData(null);
        return () => {};
      }
    } else {
      setUserData(null);
      return () => {};
    }
  };

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeFirestore = () => {};

    const setupAuthListener = async () => {
      unsubscribeAuth = auth().onAuthStateChanged(async firebaseUser => {
        setUser(firebaseUser);
        if (firebaseUser) {
          unsubscribeFirestore = await fetchUserData(firebaseUser);
        } else {
          setUserData(null);
          unsubscribeFirestore();
        }
        setLoading(false);
      });
    };

    setupAuthListener();

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const logout = () => {
    auth().signOut();
    setUser(null);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (user) {
      // Re-fetch data if needed, but the snapshot listener should handle updates automatically
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
