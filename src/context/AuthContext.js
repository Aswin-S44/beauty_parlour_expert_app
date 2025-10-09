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

  // Function to set up real-time listener for user data
  const setupUserDataListener = firebaseUser => {
    if (firebaseUser) {
      setIsEmailVerified(firebaseUser.emailVerified);
      const docRef = firestore()
        .collection(COLLECTIONS.SHOP_OWNERS)
        .doc(firebaseUser.uid);

      // Listen for real-time updates to the user document
      const unsubscribe = docRef.onSnapshot(
        docSnap => {
          if (docSnap.exists) {
            setUserData(docSnap.data());
          } else {
            // If document doesn't exist (e.g., new signup before data is fully written)
            // or deleted, clear userData
            setUserData(null);
          }
        },
        error => {
          console.error('Error fetching user data in real-time:', error);
          setUserData(null);
          setIsEmailVerified(false);
        },
      );
      return unsubscribe; // Return the unsubscribe function
    } else {
      setUserData(null);
      setIsEmailVerified(false);
      return () => {}; // Return a no-op function if no firebaseUser
    }
  };

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeFirestore = () => {}; // Initialize as no-op

    // Main authentication state listener
    unsubscribeAuth = auth().onAuthStateChanged(async firebaseUser => {
      setUser(firebaseUser);
      setLoading(true); // Set loading to true while we fetch user data

      // Clean up previous firestore listener if any
      unsubscribeFirestore();

      if (firebaseUser) {
        // Set up new firestore listener for the current user
        unsubscribeFirestore = setupUserDataListener(firebaseUser);
      } else {
        // No user, clear all user-related states
        setUserData(null);
        setIsEmailVerified(false);
      }
      setLoading(false); // Set loading to false once all checks are done
    });

    // Cleanup function for useEffect
    return () => {
      unsubscribeAuth(); // Unsubscribe from auth state changes
      unsubscribeFirestore(); // Unsubscribe from firestore snapshot listener
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const logout = () => {
    auth().signOut();
    setUser(null);
    setUserData(null);
    setIsEmailVerified(false);
  };

  // refreshUserData might not be strictly needed with onSnapshot,
  // but it can be useful if you ever need to manually force a re-fetch
  // outside the snapshot listener (e.g., after an update that doesn't use the same listener)
  const refreshUserData = async () => {
    if (user) {
      // Manually trigger a re-fetch of the user document
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
        setUserData, // Expose setUserData for manual updates
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
