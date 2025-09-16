import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { updateShop } from '../../apis/auth';
import { AuthContext, useAuth } from '../../context/AuthContext';

const GeneralInformationScreen = ({ navigation }) => {
  const [parlourName, setParlourName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserData } = useAuth();

  const { user,userData } = useContext(AuthContext);

  const handleAddGeneralInformation = async () => {
    if (!parlourName.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    console.log('---------------', userData ? userData : 'no user');
    try {
      if (user && user.uid) {
        const dataToUpdate = {
          address: address.trim(),
          parlourName: parlourName.trim(),
          profileCompleted: true,
        };

        const res = await updateShop(user.uid, dataToUpdate);

        if (res && res.success) {
          Alert.alert('Success', 'Successfully updated profile');
          setUserData({
            profileCompleted: true,
            isOnboarded: false,
            isOTPVerified: true,
          });
        } else {
          Alert.alert('Error', 'Error while updating profile');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.mainTitle}>General Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Parlour Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Beauty Life Parlor"
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={parlourName}
                onChangeText={setParlourName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="58 Street - al dulha london -USA"
                placeholderTextColor="#888"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleAddGeneralInformation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: primaryColor,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: primaryColor,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 15,
    color: '#555',
  },
  signInLink: {
    fontSize: 15,
    color: primaryColor,
    fontWeight: '500',
  },
});

export default GeneralInformationScreen;
