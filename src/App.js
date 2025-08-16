import React, { useState, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './screens/HomeScreen/HomeScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import AllAppointments from './screens/AllAppointments/AllAppointments';
import CustomDrawerContent from './components/CustomDrawerContent/CustomDrawerContent';
import ParlourDetails from './screens/ParlourDetails/ParlourDetails';
import BookingScreen from './screens/BookingScreen/BookingScreen';
import BookingSummaryScreen from './screens/BookingSummaryScreen/BookingSummaryScreen';
import AppointmentScreen from './screens/AppointmentScreen/AppointmentScreen';

import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import SignInScreen from './screens/SignInScreen/SignInScreen';
import SignUpScreen from './screens/SignUpScreen/SignUpScreen';

import { primaryColor } from './constants/colors';

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// --- Main App Navigation (After Sign In) ---
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

// --- Main App Entry Point ---
export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // This authContext allows us to change the state from a nested screen
  const authContext = useMemo(
    () => ({
      signIn: () => setIsSignedIn(true),
      signOut: () => setIsSignedIn(false),
    }),
    [],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isSignedIn ? (
            <Stack.Screen name="AppDrawer" component={AppDrawer} />
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                initialParams={{ signIn: authContext.signIn }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                initialParams={{ signIn: authContext.signIn }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
