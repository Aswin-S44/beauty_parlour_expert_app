import firestore from '@react-native-firebase/firestore';
import { firestore as db } from '../config/firebase';
import { APPOINTMENT_STATUSES } from '../constants/variables';

const CLOUDINARY_URL =
  'https://api.cloudinary.com/v1_1/personalprojectaswins/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'cloudinary_react';

export const addServices = async (shopId, data, imageUri) => {
  try {
    let imageUrl = '';
    if (imageUri) {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (responseData.secure_url) {
        imageUrl = responseData.secure_url;
      } else {
        return false;
      }
    }

    await firestore()
      .collection('services')
      .add({
        shopId: shopId,
        ...data,
        imageUrl,
        createdAt: new Date(),
      });

    return true;
  } catch (error) {
    return false;
  }
};

export const getShopServices = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('services')
      .where('shopId', '==', shopId)
      .get();

    const services = [];
    querySnapshot.forEach(doc => {
      services.push({ id: doc.id, ...doc.data() });
    });

    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const addBeautyExpert = async (shopId, data, imageUri) => {
  try {
    let imageUrl = '';
    if (imageUri) {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (responseData.secure_url) {
        imageUrl = responseData.secure_url;
      } else {
        return false;
      }
    }

    await firestore()
      .collection('beauty_experts')
      .add({
        shopId: shopId,
        ...data,
        imageUrl,
        createdAt: new Date(),
      });

    return true;
  } catch (error) {
    return false;
  }
};

export const getBeautyExperts = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('beauty_experts')
      .where('shopId', '==', shopId)
      .get();

    const experts = [];
    querySnapshot.forEach(doc => {
      experts.push({ id: doc.id, ...doc.data() });
    });

    return experts;
  } catch (error) {
    console.error('Error fetching experts:', error);
    return [];
  }
};

export const getUserData = async uid => {
  try {
    const docSnap = await firestore().collection('shop-owners').doc(uid).get();

    if (docSnap.exists) {
      return docSnap.data();
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const updateUserData = async (uid, updateData) => {
  try {
    if (
      updateData.profileImage &&
      typeof updateData.profileImage === 'string' &&
      updateData.profileImage.startsWith('file://')
    ) {
      const formData = new FormData();
      formData.append('file', {
        uri: updateData.profileImage,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (responseData.secure_url) {
        updateData.profileImage = responseData.secure_url;
      } else {
        return false;
      }
    }

    await firestore().collection('shop-owners').doc(uid).update(updateData);
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

export const addOffer = async (shopId, data) => {
  try {
    let imageUrl = '';
    if (data.imageUrl) {
      const formData = new FormData();
      formData.append('file', {
        uri: data.imageUrl,
        type: 'image/jpeg',
        name: 'offer_upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      if (responseData.secure_url) {
        imageUrl = responseData.secure_url;
      } else {
        console.error(
          'Error uploading offer image to Cloudinary: ',
          responseData,
        );
        return false;
      }
    }

    await firestore()
      .collection('offers')
      .add({
        shopId: shopId,
        ...data,
        imageUrl,
        createdAt: new Date(),
      });

    return true;
  } catch (error) {
    console.error('Error while adding offer: ', error);
    return false;
  }
};

export const getOffersByShop = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('offers')
      .where('shopId', '==', shopId)
      .get();

    const offers = await Promise.all(
      querySnapshot.docs.map(async offerDoc => {
        const offerData = offerDoc.data();
        const serviceSnap = await firestore()
          .collection('services')
          .doc(offerData.serviceId)
          .get();

        return {
          id: offerDoc.id,
          ...offerData,
          service: serviceSnap.exists
            ? { id: serviceSnap.id, ...serviceSnap.data() }
            : null,
        };
      }),
    );

    return offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
};

export const getUserRequests = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('appointments')
      .where('shopId', '==', shopId)
      .get();

    const userRequests = [];
    querySnapshot.forEach(doc => {
      userRequests.push({ id: doc.id, ...doc.data() });
    });

    return userRequests;
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }
};

// export const getAppointmentsByShopId = async shopId => {
//   try {
//     const querySnapshot = await firestore()
//       .collection('appointments')
//       .where('shopId', '==', shopId)
//       .where('appointmentStatus', 'in', ['confirmed', 'pending'])
//       .get();

//     const results = await Promise.all(
//       querySnapshot.docs.map(async appointmentDoc => {
//         const appointmentData = appointmentDoc.data();
//         const expertId = appointmentData.expertId;

//         let expertData = null;
//         if (expertId) {
//           const expertSnap = await firestore()
//             .collection('beauty_experts')
//             .doc(expertId)
//             .get();
//           if (expertSnap.exists) {
//             expertData = { id: expertSnap.id, ...expertSnap.data() };
//           }
//         }

//         return {
//           id: appointmentDoc.id,
//           ...appointmentData,
//           expert: expertData,
//         };
//       }),
//     );

//     return results;
//   } catch (error) {
//     console.error('Error fetching appointments with expert data:', error);
//     throw error;
//   }
// };

export const getAppointmentsByShopId = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('appointments')
      .where('shopId', '==', shopId)
      .where('appointmentStatus', 'in', ['confirmed', 'pending'])
      .get();

    const results = await Promise.all(
      querySnapshot.docs.map(async appointmentDoc => {
        const appointmentData = appointmentDoc.data();
        const expertId = appointmentData.expertId;
        const serviceIds = appointmentData.serviceIds || [];

        let expertData = null;
        if (expertId) {
          const expertSnap = await firestore()
            .collection('beauty_experts')
            .doc(expertId)
            .get();
          if (expertSnap.exists) {
            expertData = { id: expertSnap.id, ...expertSnap.data() };
          }
        }

        const serviceData = await Promise.all(
          serviceIds.map(async serviceId => {
            const serviceSnap = await firestore()
              .collection('services')
              .doc(serviceId)
              .get();
            if (serviceSnap.exists) {
              return { id: serviceSnap.id, ...serviceSnap.data() };
            }
            return null;
          }),
        );

        return {
          id: appointmentDoc.id,
          ...appointmentData,
          expert: expertData,
          services: serviceData.filter(service => service !== null),
        };
      }),
    );

    return results;
  } catch (error) {
    console.error(
      'Error fetching appointments with expert and service data:',
      error,
    );
    throw error;
  }
};

export const getUserPendingRequests = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('appointments')
      .where('shopId', '==', shopId)
      .where('appointmentStatus', '==', APPOINTMENT_STATUSES.PENDING)
      .get();

    const offersSnapshot = await firestore()
      .collection('offers')
      .where('shopId', '==', shopId)
      .get();

    const shopOffers = offersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const results = await Promise.all(
      querySnapshot.docs.map(async appointmentDoc => {
        const appointmentData = appointmentDoc.data();
        const expertId = appointmentData.expertId;
        const serviceIds = appointmentData.serviceIds || [];

        let expertData = null;
        if (expertId) {
          const expertSnap = await firestore()
            .collection('beauty_experts')
            .doc(expertId)
            .get();
          if (expertSnap.exists) {
            expertData = { id: expertSnap.id, ...expertSnap.data() };
          }
        }

        const services = await Promise.all(
          serviceIds.map(async serviceId => {
            const serviceSnap = await firestore()
              .collection('services')
              .doc(serviceId)
              .get();
            if (serviceSnap.exists) {
              return { id: serviceSnap.id, ...serviceSnap.data() };
            }
            return null;
          }),
        );

        const validServices = services.filter(service => service !== null);

        let offerAvailable = false;
        let offerPrice = null;

        if (serviceIds.length > 0 && shopOffers.length > 0) {
          const applicableOffers = shopOffers.filter(offer =>
            serviceIds.includes(offer.serviceId),
          );

          if (applicableOffers.length > 0) {
            offerAvailable = true;
            offerPrice =
              applicableOffers[0].price || applicableOffers[0].offerPrice;
          }
        }

        return {
          id: appointmentDoc.id,
          ...appointmentData,
          expert: expertData,
          services: validServices,
          offerAvailable,
          ...(offerAvailable && { offerPrice }),
        };
      }),
    );

    return results;
  } catch (error) {
    console.error('Error fetching appointments with expert data:', error);
    throw error;
  }
};

export const confirmAppointment = async (id, shopId) => {
  try {
    const appointmentRef = firestore().collection('appointments').doc(id);
    const appointmentSnap = await appointmentRef.get();

    if (!appointmentSnap.exists) {
      throw new Error('Appointment not found');
    }

    const appointmentData = appointmentSnap.data();

    if (appointmentData.shopId !== shopId) {
      throw new Error('Appointment does not belong to this shop');
    }

    if (appointmentData.appointmentStatus !== 'pending') {
      throw new Error('Appointment is not in pending status');
    }

    await appointmentRef.update({
      appointmentStatus: APPOINTMENT_STATUSES.CONFIRMED,
      confirmedAt: new Date(),
    });

    return { success: true, message: 'Appointment confirmed successfully' };
  } catch (error) {
    console.error('Error confirming appointment:', error);
    throw error;
  }
};

export const getAppointmentStats = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('appointments')
      .where('shopId', '==', shopId)
      .get();

    let totalAppointments = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let completedCount = 0;

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalAppointments++;

      switch (data.appointmentStatus) {
        case 'pending':
          pendingCount++;
          break;
        case 'confirmed':
          confirmedCount++;
          break;
        case 'completed':
          completedCount++;
          break;
        default:
          break;
      }
    });

    return {
      totalAppointments,
      pendingCount,
      confirmedCount,
      completedCount,
    };
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    throw error;
  }
};

export const cancelAppointment = async (id, shopId) => {
  try {
    const appointmentRef = firestore().collection('appointments').doc(id);
    const appointmentSnap = await appointmentRef.get();

    if (!appointmentSnap.exists) {
      throw new Error('Appointment not found');
    }

    const appointmentData = appointmentSnap.data();

    if (appointmentData.shopId !== shopId) {
      throw new Error('Appointment does not belong to this shop');
    }

    if (appointmentData.appointmentStatus !== 'pending') {
      throw new Error('Appointment is not in pending status');
    }

    await appointmentRef.update({
      appointmentStatus: APPOINTMENT_STATUSES.CANCELLED,
      cancelledAt: new Date(),
    });

    return { success: true, message: 'Appointment cancelled successfully' };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

export const getShopSlots = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('slots')
      .where('shopId', '==', shopId)
      .get();

    const slots = [];
    querySnapshot.forEach(doc => {
      slots.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: slots };
  } catch (error) {
    console.error('Error getting shop slots:', error);
    throw error;
  }
};

export const getSlotsByDate = async (shopId, date) => {
  try {
    const querySnapshot = await firestore()
      .collection('slots')
      .where('shopId', '==', shopId)
      .where('date', '==', date)
      .get();

    const slots = [];
    querySnapshot.forEach(doc => {
      slots.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: slots };
  } catch (error) {
    console.error('Error getting slots by date:', error);
    throw error;
  }
};

export const deleteSlot = async (slotId, shopId) => {
  try {
    const slotRef = firestore().collection('slots').doc(slotId);
    const slotSnap = await slotRef.get();

    if (!slotSnap.exists) {
      throw new Error('Slot not found');
    }

    const slotData = slotSnap.data();

    if (slotData.shopId !== shopId) {
      throw new Error('Slot does not belong to this shop');
    }

    await slotRef.delete();

    return { success: true, message: 'Slot deleted successfully' };
  } catch (error) {
    console.error('Error deleting slot:', error);
    throw error;
  }
};

export const getNotificationsByShopId = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('notifications')
      .where('toId', '==', shopId)
      .get();

    const notifications = await Promise.all(
      querySnapshot.docs.map(async doc => {
        const data = doc.data();
        const customerSnapshot = await firestore()
          .collection('customers')
          .where('uid', '==', data.fromId)
          .limit(1)
          .get();

        const customer = !customerSnapshot.empty
          ? {
              id: customerSnapshot.docs[0].id,
              ...customerSnapshot.docs[0].data(),
            }
          : null;

        return { id: doc.id, ...data, customer };
      }),
    );

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async id => {
  try {
    const notificationRef = firestore().collection('notifications').doc(id);
    const docSnapshot = await notificationRef.get();

    if (!docSnapshot.exists) {
      return { success: false, message: 'Notification not found' };
    }

    await notificationRef.update({
      isRead: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating notification:', error);
    return { success: false, error };
  }
};

export const deleteService = async (serviceId, shopId) => {
  try {
    const serviceRef = firestore().collection('services').doc(serviceId);
    const serviceSnap = await serviceRef.get();

    if (!serviceSnap.exists) {
      throw new Error('Services not exist not found');
    }

    const serviceData = serviceSnap.data();

    if (serviceData.shopId !== shopId) {
      throw new Error('Service does not belong to this shop');
    }

    await serviceRef.delete();

    return { success: true, message: 'Service deleted successfully' };
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

const uploadImage = async image => {
  try {
    if (image === 'string' && image.startsWith('file://')) {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (responseData.secure_url) {
        return responseData.secure_url;
      }
    }
  } catch (error) {
    console.log('Error uploading image: ', error);
    return error;
  }
};

export const updateService = async (uid, updateData) => {
  try {
    if (!updateData.imageUri.startsWith('https://')) {
      const formData = new FormData();
      formData.append('file', {
        uri: updateData.imageUri,
        type: 'image/jpeg',
        name: 'offer_upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      if (responseData.secure_url) {
        updateData.imageUrl = responseData.secure_url;
      }
    }

    await firestore().collection('services').doc(uid).update(updateData);
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

export const deleteExpert = async (expertId, shopId) => {
  try {
    const expertRef = firestore().collection('beauty_experts').doc(expertId);
    const expertSnap = await expertRef.get();

    if (!expertSnap.exists) {
      throw new Error('Expert not found');
    }

    const expertData = expertSnap.data();

    if (expertData.shopId !== shopId) {
      throw new Error('Expert does not belong to this shop');
    }

    await expertRef.delete();

    return { success: true, message: 'Expert deleted successfully' };
  } catch (error) {
    console.error('Error deleting expert:', error);
    throw error;
  }
};

export const updateBeautyExpert = async (uid, updateData) => {
  try {
    if (!updateData.imageUri.startsWith('https://')) {
      const formData = new FormData();
      formData.append('file', {
        uri: updateData.imageUri,
        type: 'image/jpeg',
        name: 'offer_upload.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      if (responseData.secure_url) {
        updateData.imageUrl = responseData.secure_url;
      }
    }

    await firestore().collection('beauty_experts').doc(uid).update(updateData);
    return true;
  } catch (error) {
    console.error('Error updating beauty expert:', error);
    return false;
  }
};

export const deleteOffer = async (offerId, shopId) => {
  try {
    const offerRef = firestore().collection('offers').doc(offerId);
    const offerSnap = await offerRef.get();

    if (!offerSnap.exists) {
      throw new Error('Offer not found');
    }

    const offerData = offerSnap.data();

    if (offerData.shopId !== shopId) {
      throw new Error('Offer does not belong to this shop');
    }

    await offerRef.delete();

    return { success: true, message: 'Offer deleted successfully' };
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
};

export const updateServiceOffer = async (uid, updateData) => {
  try {
    await firestore().collection('offers').doc(uid).update(updateData);
    return true;
  } catch (error) {
    console.error('Error updating offer:', error);
    return false;
  }
};

export const getNotificationsCountByShopId = async shopId => {
  try {
    const querySnapshot = await firestore()
      .collection('notifications')
      .where('toId', '==', shopId)
      .where('isRead', '==', false)
      .get();

    return querySnapshot?.size ?? 0;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return 0;
  }
};
