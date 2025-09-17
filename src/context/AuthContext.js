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
        const docSnap = await firestore()
          .collection(COLLECTIONS.SHOP_OWNERS)
          .doc(firebaseUser.uid)
          .get();

        if (docSnap.exists) {
          setUserData(docSnap.data());
        } else {
          setUserData(null); // User data not found
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    auth().signOut();
    setUser(null);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user);
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
