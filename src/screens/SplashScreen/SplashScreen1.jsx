import React from 'react';
import { Text, StyleSheet, StatusBar, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { lightPurple, primaryColor } from '../../constants/colors';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={[primaryColor, lightPurple]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require('../../assets/images/splash_logo.png')}
        style={styles.welcomeImage}
      />
      <Text style={styles.title}>Beautyon</Text>
      <Text style={styles.loadingText}>Loading....</Text>
    </LinearGradient>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 150,
  },
  welcomeImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
