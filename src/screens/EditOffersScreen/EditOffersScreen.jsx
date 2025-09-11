import { View, Text } from 'react-native';
import React from 'react';

const EditOffersScreen = ({ route }) => {
  const { offer } = route.params;
  console.log('Offer-----------------', offer ? offer : 'no offer');
  return (
    <View>
      <Text>EditOffersScreen</Text>
    </View>
  );
};

export default EditOffersScreen;
