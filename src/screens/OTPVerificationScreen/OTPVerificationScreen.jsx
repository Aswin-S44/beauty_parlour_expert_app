import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primaryColor } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { resentOTP, updateShop, verifyOtp } from '../../apis/auth';

export const resetPassword = async email => {
  try {
    await auth().sendPasswordResetEmail(email);
    return true;
  } catch (error) {
    throw error;
  }
};

const OTPVerificationScreen = ({ navigation, route }) => {
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const fifthInput = useRef();
  const sixthInput = useRef();

  const [otp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, userData, loading } = useContext(AuthContext);

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    const otpValue = Object.values(otp).join('');

    try {
      if (user && user.email && user.uid) {
        const res = await verifyOtp(user?.email, otpValue);

        if (res && res.success) {
          const uidToUpdate = user?.uid || res.userData.uid; // fallback if user is not signed in
          await updateShop(uidToUpdate, { isOTPVerified: true });
          if (user?.uid) {
            navigation.navigate('GeneralInformationScreen');
          }
        } else {
          Alert.alert('Invalid OTP','Please verify your otp');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during OTP verification.');
      return error;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResentOTP = async () => {
    if (user && user.email) {
      try {
        const res = await resentOTP(user?.email);
        setOtp({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
      } catch (error) {
        console.log('Error while resent otp : ', error);
        setError(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={isVerifying}
      >
        <Ionicons name="arrow-back" size={28} color={primaryColor} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>OTP Verification</Text>
        <Image
          source={require('../../assets/images/forgot-password.png')}
          style={styles.illustration}
        />

        <Text style={styles.infoText}>Enter OTP Sent To:</Text>
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't get OTP code? </Text>
          <TouchableOpacity disabled={isVerifying} onPress={handleResentOTP}>
            <Text style={styles.resendLink}>RESEND</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.otpInputContainer}>
          {[1, 2, 3, 4, 5, 6].map((digit, index) => {
            const refs = [
              firstInput,
              secondInput,
              thirdInput,
              fourthInput,
              fifthInput,
              sixthInput,
            ];
            return (
              <View key={digit} style={styles.otpBox}>
                <TextInput
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={refs[index]}
                  onChangeText={text => {
                    setOtp({ ...otp, [digit]: text });

                    if (text && index < 5) {
                      refs[index + 1].current.focus();
                    }

                    if (!text && index > 0) {
                      refs[index - 1].current.focus();
                    }
                  }}
                  editable={!isVerifying}
                />
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleVerifyOTP}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>NEXT</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Back to SignIn? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            disabled={isVerifying}
          >
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent={true} animationType="fade" visible={isVerifying}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#333',
    marginBottom: 20,
  },
  illustration: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#888',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  resendText: {
    fontSize: 15,
    color: '#888',
  },
  resendLink: {
    fontSize: 15,
    color: primaryColor,
    fontWeight: 'bold',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 40,
  },
  otpBox: {
    width: 45,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  createButton: {
    backgroundColor: primaryColor,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
    marginTop: 20,
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
    marginTop: 4,
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default OTPVerificationScreen;
