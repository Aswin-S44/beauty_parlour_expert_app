import React, { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import HomeScreen from './screens/HomeScreen/HomeScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import AllAppointments from './screens/AllAppointments/AllAppointments';
import CustomDrawerContent from './components/CustomDrawerContent/CustomDrawerContent';
import ParlourDetails from './screens/ParlourDetails/ParlourDetails';
import BookingScreen from './screens/BookingScreen/BookingScreen';
import BookingSummaryScreen from './screens/BookingSummaryScreen/BookingSummaryScreen';
import AppointmentScreen from './screens/AppointmentScreen/AppointmentScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen/ChangePasswordScreen';
import HelpSupportScreen from './screens/HelpSupportScreen/HelpSupportScreen';
import BeautyExpertDetailsScreen from './screens/BeautyExpertDetailsScreen/BeautyExpertDetailsScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen/OTPVerificationScreen';
import SplashScreen1 from './screens/SplashScreen/SplashScreen1';
import OnboardingScreen from './screens/OnboardingScreen/OnboardingScreen';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import SignInScreen from './screens/SignInScreen/SignInScreen';
import SignUpScreen from './screens/SignUpScreen/SignUpScreen';
import AppointmentRequestsScreen from './screens/AppointmentRequestsScreen/AppointmentRequestsScreen';
import AllServicesScreen from './screens/AllServicesScreen/AllServicesScreen';
import AddServicesScreen from './screens/AddServicesScreen/AddServicesScreen';
import ExpertsScreen from './screens/ExpertsScreen/ExpertsScreen';
import AddExpertScreeen from './screens/AddExpertScreeen/AddExpertScreeen';
import AllOffersScreen from './screens/AllOffersScreen/AllOffersScreen';
import AddOffersScreen from './screens/AddOffersScreen/AddOffersScreen';
// import AddGeneralInformationScreen from './screens/AddGeneralInformationScreen/AddGeneralInformationScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen/PrivacyPolicyScreen';
import { AuthContext } from './context/AuthContext';
import { primaryColor } from './constants/colors';
import EditProfileScreen from './screens/EditProfileScreen/EditProfileScreen';
import ServiceSummaryScreen from './screens/ServiceSummaryScreen/ServiceSummaryScreen';
import ConfirmationWaitingScreen from './screens/ConfirmationWaitingScreen/ConfirmationWaitingScreen';
import GeneralInformationScreen from './screens/GeneralInformationScreen/GeneralInformationScreen';
import SlotsManagementScreen from './screens/SlotsManagementScreen/SlotsManagementScreen';
import FirebaseNotificationService from './apis/FirebaseNotificationService';
import { auth } from './config/firebase'; // Ensure this imports the firebase auth instance
import AllNotificationScreen from './screens/AllNotificationScreen/AllNotificationScreen';
import NofificationDetailsScreen from './screens/NofificationDetailsScreen/NofificationDetailsScreen';
import EditServicesScreen from './screens/EditServicesScreen/EditServicesScreen';
import ServiceDetailsScreen from './screens/ServiceDetailsScreen/ServiceDetailsScreen';
import EditExpertScreen from './screens/EditExpertScreen/EditExpertScreen';
import ExpertDetailsScreen from './screens/ExpertDetailsScreen/ExpertDetailsScreen';
import EditOffersScreen from './screens/EditOffersScreen/EditOffersScreen';
import OfferDetailsScreen from './screens/OfferDetailsScreen/OfferDetailsScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen/ResetPasswordScreen';
import { StyleSheet } from 'react-native';
import { getPendingRequestsCount } from './apis/services';

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ParlourDetails" component={ParlourDetails} />
      <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
      <Stack.Screen
        name="BookingSummaryScreen"
        component={BookingSummaryScreen}
      />
      <Stack.Screen
        name="BeautyExpertDetailsScreen"
        component={BeautyExpertDetailsScreen}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      barStyle={{ backgroundColor: '#fff' }}
      activeColor="#ffffff"
      inactiveColor="#cccccc"
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="home"
              size={focused ? 26 : 20}
              color={focused ? primaryColor : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Request"
        component={AppointmentRequestsScreen}
        options={{
          tabBarLabel: 'Shops',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="chatbox-ellipses-sharp"
              size={focused ? 26 : 20}
              color={focused ? primaryColor : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={AllAppointments}
        options={{
          tabBarLabel: 'Appointments',
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="calendar"
              size={focused ? 26 : 20}
              color={focused ? primaryColor : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SlotsManagementScreen"
        component={SlotsManagementScreen}
        options={{
          tabBarLabel: 'Slots',
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="clock"
              size={focused ? 26 : 20}
              color={focused ? primaryColor : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="person-circle-outline"
              size={focused ? 26 : 20}
              color={focused ? primaryColor : color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{ width: 300 }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
      <Stack.Screen name="AllServicesScreen" component={AllServicesScreen} />
      <Stack.Screen name="AddServicesScreen" component={AddServicesScreen} />
      <Stack.Screen name="ExpertsScreen" component={ExpertsScreen} />
      <Stack.Screen name="AddExpertScreeen" component={AddExpertScreeen} />
      <Stack.Screen name="AllOffersScreen" component={AllOffersScreen} />
      <Stack.Screen name="AddOffersScreen" component={AddOffersScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen
        name="ServiceSummaryScreen"
        component={ServiceSummaryScreen}
      />
      <Stack.Screen
        name="AllNotificationScreen"
        component={AllNotificationScreen}
      />
      <Stack.Screen
        name="NofificationDetailsScreen"
        component={NofificationDetailsScreen}
      />
      <Stack.Screen name="EditServiceScreen" component={EditServicesScreen} />
      <Stack.Screen
        name="ServiceDetailsScreen"
        component={ServiceDetailsScreen}
      />
      <Stack.Screen name="EditExpertScreen" component={EditExpertScreen} />
      <Stack.Screen
        name="ExpertDetailsScreen"
        component={ExpertDetailsScreen}
      />
      <Stack.Screen name="EditOffersScreen" component={EditOffersScreen} />
      <Stack.Screen name="OfferDetailsScreen" component={OfferDetailsScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* <Stack.Screen
        name="AddGeneralInformationScreen"
        component={AddGeneralInformationScreen}
      /> */}
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name="ConfirmationWaitingScreen"
        component={ConfirmationWaitingScreen}
      />
      {/* OTPVerificationScreen should primarily be in OTPStack or be navigable from AuthStack if needed */}
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
      />
      <Stack.Screen
        name="GeneralInformationScreen"
        component={GeneralInformationScreen}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
}

function OTPStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
      />
      {/* Include GeneralInformationScreen in OTPStack if it's the next step after OTP verification for new users */}
      <Stack.Screen
        name="GeneralInformationScreen"
        component={GeneralInformationScreen}
      />
      {/* Potentially allow navigation back to SignIn/SignUp from OTP if user abandons */}
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const { user, userData, loading, setLoading } = useContext(AuthContext);
  const [fcmToken, setFcmToken] = useState('');
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    // This effect runs whenever user or userData changes, or when app is loaded.
    // We only want to set up FCM when a user is logged in AND onboarded.
    if (user && userData?.isOnboarded && !userData.fcmToken) {
      const initializeAppNotifications = async () => {
        try {
          // Initialize Firebase Notification Service
          FirebaseNotificationService.setupNotificationHandlers();
          const hasPermission =
            await FirebaseNotificationService.requestNotificationPermission();
          if (hasPermission) {
            const token = await FirebaseNotificationService.getFCMToken();
            setFcmToken(token);
          }
        } catch (error) {
          console.error('App notification initialization error:', error);
        }
      };

      initializeAppNotifications();

      // Listener for when the Firebase auth token refreshes
      const unsubscribeAuthTokenRefresh = auth().onAuthStateChanged(
        async currentUser => {
          if (currentUser) {
            const token = await FirebaseNotificationService.getFCMToken();
            setFcmToken(token);
          }
        },
      );

      return () => {
        unsubscribeAuthTokenRefresh();
      };
    }
  }, [user?.uid, userData]); // Depend on user and userData to re-run when these change

  useEffect(() => {
    const timer = setTimeout(() => {
      // After 5 seconds, if still loading, mark timeoutReached as true
      setTimeoutReached(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (loading && !timeoutReached) {
    return <SplashScreen1 />;
  }

  // Define navigation logic clearly
  let currentStack;

  let curentScreen = 'no screen';

  if (!user) {
    // No user authenticated
    currentStack = <AuthStack />;
    curentScreen = 'auth';
  } else if (!userData && !timeoutReached) {
    // User exists in Firebase auth, but userData hasn't loaded from Firestore yet,
    // or the user's document doesn't exist (e.g., just signed up).
    // Show splash screen or a generic loading indicator here.
    // It's crucial that `AuthContext` ensures `userData` is populated or `null` quickly.
    currentStack = <SplashScreen1 />; // Or another loading component
    curentScreen = 'splash';
  } else if (!userData && timeoutReached) {
    currentStack = <AuthStack />;
    curentScreen = 'auth2';
  } else if (userData.emailVerified && !userData.profileCompleted) {
    // User is authenticated but OTP is not verified
    currentStack = <GeneralInformationScreen />;
  } else if (!userData.isOnboarded && !userData.profileCompleted) {
    // OTP is verified, but user needs to complete general info
    currentStack = <GeneralInformationScreen />;
    curentScreen = 'general information';
  } else if (!userData.isOnboarded && userData.profileCompleted) {
    // General info completed, but waiting for admin confirmation
    currentStack = <ConfirmationWaitingScreen />;
    curentScreen = 'confirmation';
  } else {
    // User is fully authenticated, OTP verified, onboarded, and profile completed
    currentStack = <MainAppStack />;
    curentScreen = 'main';
  }
  console.log('curentScreen----------------', curentScreen);
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>{currentStack}</NavigationContainer>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 18, // Center text vertically
  },
});
