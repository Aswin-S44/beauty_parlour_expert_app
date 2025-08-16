import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';

const BookingSummaryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
            Service Summary
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginVertical: 15,
          }}
        >
          Service Summary
        </Text>

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
          Date & Time
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <Text>Date</Text>
          <Text>25 August 2021</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <Text>Time</Text>
          <Text>08.00 pm</Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
          Amount
        </Text>
        <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 10 }}>
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

          <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1 }}>Style Hair Cut</Text>
            <Text style={{ width: 80 }}>01</Text>
            <Text style={{ width: 60 }}>$25</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1 }}>Spa</Text>
            <Text style={{ width: 80 }}>01</Text>
            <Text style={{ width: 60 }}>$100</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1 }}>Skin Treatment</Text>
            <Text style={{ width: 80 }}>01</Text>
            <Text style={{ width: 60 }}>$80</Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#eee' }} />

          <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1 }}>Subtotal</Text>
            <Text style={{ width: 80 }} />
            <Text style={{ width: 60 }}>$205</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1 }}>Discount by coupon</Text>
            <Text style={{ width: 80 }} />
            <Text style={{ width: 60 }}>- $10</Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#eee' }} />

          <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1, fontWeight: '700' }}>Total</Text>
            <Text style={{ width: 80 }} />
            <Text style={{ width: 60, fontWeight: '700' }}>$195</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          backgroundColor: '#8E24AA',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          margin: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Confirm
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#8E24AA',
                borderRadius: 50,
                padding: 15,
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 30, color: '#fff' }}>✔</Text>
            </View>
            <Text
              style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}
            >
              Successfully send your request. Waiting for confirmation.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 6,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingSummaryScreen;
