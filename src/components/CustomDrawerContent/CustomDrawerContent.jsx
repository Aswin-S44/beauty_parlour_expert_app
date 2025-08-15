import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomDrawerContent = props => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          {/* <Image
            source={require('../assets/beauty-parlour-logo.png')} // Replace with your logo
            style={styles.logo}
          /> */}
          <Text style={styles.title}>Beauty Parlour</Text>
          <Text style={styles.subtitle}>Booking App</Text>
        </View>

        <DrawerItemList {...props} />

        <View style={styles.drawerSection}>
          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="home" size={20} color="#333" />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="calendar" size={20} color="#333" />
            <Text style={styles.drawerItemText}>Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="user" size={20} color="#333" />
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Icon name="cog" size={20} color="#333" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      <View style={styles.bottomDrawerSection}>
        <TouchableOpacity style={styles.drawerItem}>
          <Icon name="sign-out" size={20} color="#333" />
          <Text style={styles.drawerItemText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  drawerSection: {
    marginTop: 15,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default CustomDrawerContent;
