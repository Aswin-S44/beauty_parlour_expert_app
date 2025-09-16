import { Platform, PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { auth, firestore } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';

class FirebaseNotificationService {
  static async requestNotificationPermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message:
                'This app needs notification permissions to send you updates',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        return true;
      } else {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  static async getFCMToken() {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }

      const token = await messaging().getToken();

      await this.storeFCMToken(token);

      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  static async storeFCMToken(token) {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await firestore()
          .collection(COLLECTIONS.SHOP_OWNERS)
          .doc(currentUser.uid)
          .set(
            {
              fcmToken: token,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
      }
    } catch (error) {
      console.error('Error storing FCM token:', error);
    }
  }

  static setupNotificationHandlers() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'New message received',
        [
          {
            text: 'OK',
            onPress: () => console.log('Notification pressed'),
          },
        ],
      );
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background:', remoteMessage);
      // Handle navigation based on notification data
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened by notification:', remoteMessage);
        }
      });

    return unsubscribe;
  }

  static async subscribeToShopTopic(shopId) {
    try {
      await messaging().subscribeToTopic(`shop_${shopId}`);
      console.log(`Subscribed to shop topic: shop_${shopId}`);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
    }
  }

  static async unsubscribeFromShopTopic(shopId) {
    try {
      await messaging().unsubscribeFromTopic(`shop_${shopId}`);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
    }
  }
}

export default FirebaseNotificationService;
