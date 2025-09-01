import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
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
        console.log('Error uploading to Cloudinary: ', responseData);
        return false;
      }
    }

    const servicesCollectionRef = collection(db, 'services');

    await addDoc(servicesCollectionRef, {
      shopId: shopId,
      ...data,
      imageUrl,
      createdAt: new Date(),
    });

    return true;
  } catch (error) {
    console.log('Error while adding service : ', error);
    return false;
  }
};

export const getShopServices = async shopId => {
  try {
    const q = query(collection(db, 'services'), where('shopId', '==', shopId));

    const querySnapshot = await getDocs(q);

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
        console.log('Error uploading to Cloudinary: ', responseData);
        return false;
      }
    }

    const expertCollectionRef = collection(db, 'beauty_experts');

    await addDoc(expertCollectionRef, {
      shopId: shopId,
      ...data,
      imageUrl,
      createdAt: new Date(),
    });

    return true;
  } catch (error) {
    console.log('Error while adding beauty expert : ', error);
    return false;
  }
};

export const getBeautyExperts = async shopId => {
  try {
    const q = query(
      collection(db, 'beauty_experts'),
      where('shopId', '==', shopId),
    );

    const querySnapshot = await getDocs(q);

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
    const docRef = doc(db, 'shop-owners', uid);
    const docSnap = await getDoc(docRef);
    console.log('docSnap exists?', docSnap.exists());
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (e) {
    console.log('Firestore error:', e);
    return null;
  }
};

export const updateUserData = async (uid, updateData) => {
  if (updateData.profileImage) {
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
      console.log('Error uploading to Cloudinary: ', responseData);
      return false;
    }
  }
  await updateDoc(doc(db, 'shop-owners', uid), updateData);
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

    const offersCollectionRef = collection(db, 'offers');

    await addDoc(offersCollectionRef, {
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
  const q = query(collection(db, 'offers'), where('shopId', '==', shopId));
  const querySnapshot = await getDocs(q);

  const offers = await Promise.all(
    querySnapshot.docs.map(async offerDoc => {
      const offerData = offerDoc.data();
      const serviceRef = doc(db, 'services', offerData.serviceId);
      const serviceSnap = await getDoc(serviceRef);

      return {
        id: offerDoc.id,
        ...offerData,
        service: serviceSnap.exists()
          ? { id: serviceSnap.id, ...serviceSnap.data() }
          : null,
      };
    }),
  );

  return offers;
};

export const getUserRequests = async shopId => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('shopId', '==', shopId),
    );

    const querySnapshot = await getDocs(q);

    const userRequests = [];
    querySnapshot.forEach(doc => {
      userRequests.push({ id: doc.id, ...doc.data() });
    });

    return userRequests;
  } catch (error) {
    console.error('Error fetching experts:', error);
    return [];
  }
};

export const getAppointmentsByShopId = async shopId => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('shopId', '==', shopId),
      where('appointmentStatus', 'in', ['confirmed', 'pending']),
    );
    const querySnapshot = await getDocs(q);

    const results = await Promise.all(
      querySnapshot.docs.map(async appointmentDoc => {
        const appointmentData = appointmentDoc.data();
        const expertId = appointmentData.expertId;

        let expertData = null;
        if (expertId) {
          const expertRef = doc(db, 'beauty_experts', expertId);
          const expertSnap = await getDoc(expertRef);
          if (expertSnap.exists()) {
            expertData = { id: expertSnap.id, ...expertSnap.data() };
          }
        }

        return {
          id: appointmentDoc.id,
          ...appointmentData,
          expert: expertData,
        };
      }),
    );

    return results;
  } catch (error) {
    console.error('Error fetching appointments with expert data:', error);
    throw error;
  }
};

export const getUserPendingRequests = async shopId => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('shopId', '==', shopId),
      where('appointmentStatus', '==', APPOINTMENT_STATUSES.PENDING),
    );
    const querySnapshot = await getDocs(q);

    const offersQuery = query(
      collection(db, 'offers'),
      where('shopId', '==', shopId),
    );
    const offersSnapshot = await getDocs(offersQuery);
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
          const expertRef = doc(db, 'beauty_experts', expertId);
          const expertSnap = await getDoc(expertRef);
          if (expertSnap.exists()) {
            expertData = { id: expertSnap.id, ...expertSnap.data() };
          }
        }

        const services = await Promise.all(
          serviceIds.map(async serviceId => {
            const serviceRef = doc(db, 'services', serviceId);
            const serviceSnap = await getDoc(serviceRef);
            if (serviceSnap.exists()) {
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
    const appointmentRef = doc(db, 'appointments', id);
    const appointmentSnap = await getDoc(appointmentRef);

    if (!appointmentSnap.exists()) {
      throw new Error('Appointment not found');
    }

    const appointmentData = appointmentSnap.data();

    if (appointmentData.shopId !== shopId) {
      throw new Error('Appointment does not belong to this shop');
    }

    if (appointmentData.appointmentStatus !== 'pending') {
      throw new Error('Appointment is not in pending status');
    }

    await updateDoc(appointmentRef, {
      appointmentStatus: APPOINTMENT_STATUSES.CONFIRMED,
      confirmedAt: new Date(),
    });

    console.log('Appointment confirmed successfully');
    return { success: true, message: 'Appointment confirmed successfully' };
  } catch (error) {
    console.error('Error confirming appointment:', error);
    throw error;
  }
};

export const getAppointmentStats = async shopId => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('shopId', '==', shopId),
    );
    const querySnapshot = await getDocs(q);

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
