// services.js

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
