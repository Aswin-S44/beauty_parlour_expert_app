import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';

const AllAppointments = () => {
  const appointments = [
    {
      id: '1',
      name: 'Fahima Khan',
      date: '2 Feb 2021, 12:00 pm',
      amount: 120,
      status: 'Running',
      imageUrl: 'https://i.imgur.com/6t4k2j6.png',
    },
    {
      id: '2',
      name: 'Mariya Tuba',
      date: '1 Feb 2021, 05:00 pm',
      amount: 250,
      status: 'Running',
      imageUrl: 'https://i.imgur.com/xgA31iK.png',
    },
    {
      id: '3',
      name: 'Sakina Joshifa',
      date: '22 Jan 2021, 04.30 pm',
      amount: 99,
      status: 'Completed',
      imageUrl: 'https://i.imgur.com/S5ai1Jg.png',
    },
    {
      id: '4',
      name: 'Lifaniya Mujo',
      date: '21 Jan 2021, 09:15 am',
      amount: 130,
      status: 'Completed',
      imageUrl: 'https://i.imgur.com/i4j1k7G.png',
    },
    {
      id: '5',
      name: 'Wakina Tashiya',
      date: '15 Jan 2021, 12:05 am',
      amount: 50,
      status: 'Completed',
      imageUrl: 'https://i.imgur.com/gDaIp0D.png',
    },
  ];

  const renderAppointment = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
        <Text style={styles.itemAmountText}>Amount {item.amount}</Text>
      </View>
      <View style={styles.itemStatus}>
        <Text style={styles.itemPrice}>${item.amount}</Text>
        <Text style={styles.itemStatusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/home_bg-1.png')}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Appointment History</Text>
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 180,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.5)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  itemAmountText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  itemStatus: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemStatusText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default AllAppointments;
