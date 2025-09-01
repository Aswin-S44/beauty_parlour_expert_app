import React, { useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, View } from 'react-native';

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
import NearByShopsList from './screens/NearByShopsList/NearByShopsList';
import BeautyExpertDetailsScreen from './screens/BeautyExpertDetailsScreen/BeautyExpertDetailsScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen/OTPVerificationScreen';
import SplashScreen from './screens/SplashScreen/SplashScreen';
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
import AddGeneralInformationScreen from './screens/AddGeneralInformationScreen/AddGeneralInformationScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen/PrivacyPolicyScreen';
import { AuthContext } from './context/AuthContext';
import { primaryColor } from './constants/colors';
import EditProfileScreen from './screens/EditProfileScreen/EditProfileScreen';
import ServiceSummaryScreen from './screens/ServiceSummaryScreen/ServiceSummaryScreen';

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
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
      />
      <Stack.Screen
        name="AddGeneralInformationScreen"
        component={AddGeneralInformationScreen}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen1 />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {user ? <MainAppStack /> : <AuthStack />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
