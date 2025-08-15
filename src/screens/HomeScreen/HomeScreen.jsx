import { View, Text } from 'react-native';
import React, { useState } from 'react';

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;
