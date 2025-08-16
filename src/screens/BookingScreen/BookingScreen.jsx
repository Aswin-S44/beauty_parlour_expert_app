import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookingScreen = ({ navigation }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const experts = [
    { id: 1, name: 'Robat Jonson', image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Markal hums', image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Lifsa Zuli', image: 'https://via.placeholder.com/80' },
    { id: 4, name: 'Washin Tomas', image: 'https://via.placeholder.com/80' },
  ];

  const times = [
    { time: '8:00 am', booked: false },
    { time: '9:00 am', booked: false },
    { time: '10:00 am', booked: true },
    { time: '11:00 am', booked: false },
    { time: '12:00 pm', booked: false },
    { time: '1:00 pm', booked: false },
    { time: '2:00 pm', booked: false },
    { time: '3:00 pm', booked: false },
    { time: '4:00 pm', booked: true },
    { time: '5:00 pm', booked: false },
    { time: '6:00 pm', booked: true },
    { time: '7:00 pm', booked: false },
    { time: '8:00 pm', booked: false },
    { time: '9:00 pm', booked: false },
  ];

  const services = [
    { id: 1, name: 'Style Hair Cut', qty: '01', price: '$25' },
    { id: 2, name: 'Spa', qty: '01', price: '$100' },
    { id: 3, name: 'Skin Treatment', qty: '01', price: '$200' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#8E24AA',
          height: 100,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}
      >
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
            Appointment
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Experts */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 15 }}>
            Choose Your Beauty Expert
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {experts.map(expert => (
              <View
                key={expert.id}
                style={{ alignItems: 'center', marginRight: 20 }}
              >
                <Image
                  source={{ uri: expert.image }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginBottom: 5,
                  }}
                />
                <Text>{expert.name}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Date Picker */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 15 }}>
            Select Date
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 15,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#555' }}>25 August 2020</Text>
            <Icon name="calendar-today" size={20} color="#555" />
          </TouchableOpacity>

          {/* Time Slots */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 15 }}>
            Select Time Slot
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 20,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#8E24AA',
                  marginRight: 5,
                }}
              />
              <Text>Available</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#D1C4E9',
                  marginRight: 5,
                }}
              />
              <Text>Booked</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {times.map(slot => (
              <TouchableOpacity
                key={slot.time}
                onPress={() => !slot.booked && setSelectedTime(slot.time)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  margin: 5,
                  backgroundColor: slot.booked
                    ? '#D1C4E9'
                    : selectedTime === slot.time
                    ? '#8E24AA'
                    : '#F3E5F5',
                }}
              >
                <Text
                  style={{
                    color: slot.booked
                      ? '#555'
                      : selectedTime === slot.time
                      ? '#fff'
                      : '#4A148C',
                  }}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Service Amount */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 15 }}>
            Service Amount
          </Text>
          <View
            style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 10 }}
          >
            <View
              style={{
                flexDirection: 'row',
                padding: 12,
                backgroundColor: '#f8f8f8',
              }}
            >
              <Text style={{ flex: 1, fontWeight: '600' }}>Service</Text>
              <Text style={{ width: 80, fontWeight: '600' }}>Quantity</Text>
              <Text style={{ width: 60, fontWeight: '600' }}>Price</Text>
            </View>
            {services.map(service => (
              <View
                key={service.id}
                style={{ flexDirection: 'row', padding: 12 }}
              >
                <Text style={{ flex: 1 }}>{service.name}</Text>
                <Text style={{ width: 80 }}>{service.qty}</Text>
                <Text style={{ width: 60 }}>{service.price}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={{ paddingBottom: 50 }}
            onPress={() => navigation.navigate('BookingSummaryScreen')}
          >
            <Text>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default BookingScreen;
