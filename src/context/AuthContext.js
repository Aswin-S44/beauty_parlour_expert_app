import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { auth as firebaseAuth, firestore } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docSnap = await firestore()
            .collection(COLLECTIONS.SHOP_OWNERS)
            .doc(firebaseUser.uid)
            .get();

          if (docSnap.exists) {
            setUserData(docSnap.data());
          }
        } catch (err) {
          return err;
        }
      } else {
        setUser(null);
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

  return (
    <AuthContext.Provider
      value={{ user, userData, logout, loading, setLoading, setUserData }}
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
