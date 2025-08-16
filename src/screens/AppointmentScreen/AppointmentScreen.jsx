import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { primaryColor } from '../../constants/colors';

const AppointmentScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('Child');
  const services = [
    {
      id: 1,
      title: 'Hair cut',
      types: '20 Types',
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      title: 'Facial',
      types: '20 Types',
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 3,
      title: 'Hair Treatment',
      types: '15 Types',
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 4,
      title: 'Makeup',
      types: '10 Types',
      image: 'https://via.placeholder.com/80',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          backgroundColor: primaryColor,
          height: 120,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '600' }}>
          Appointment
        </Text>
      </View>

      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
          Customer Type
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {['Child', 'Women', 'Others'].map(type => (
            <TouchableOpacity
              key={type}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 20,
              }}
              onPress={() => setSelectedType(type)}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#8E24AA',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                {selectedType === type && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: '#8E24AA',
                    }}
                  />
                )}
              </View>
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
          Select Services
        </Text>
        {services.map(service => (
          <View
            key={service.id}
            style={{
              flexDirection: 'row',
              backgroundColor: '#f8f8f8',
              borderRadius: 12,
              marginBottom: 15,
              overflow: 'hidden',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: service.image }}
              style={{ width: 80, height: 80 }}
            />
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {service.title}
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                {service.types}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#E1BEE7',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 8,
                marginRight: 10,
              }}
            >
              <Text style={{ color: '#4A148C' }}>Styles ▼</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#8E24AA',
            padding: 18,
            alignItems: 'center',
            width: '90%',
          }}
          onPress={() => navigation.navigate('BookingScreen')}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentScreen;
