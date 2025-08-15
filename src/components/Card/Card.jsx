import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ image, title, location, rating, status }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.badgesContainer}>
        <View style={[styles.badge, { backgroundColor: '#8E44AD' }]}>
          <Text style={styles.badgeText}>{rating} ★</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#F2CBEE' }]}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardLocation}>{location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 15,
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden',
    height: 230,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  badgesContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 8,
    marginHorizontal: 10,
  },
  cardLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    marginHorizontal: 10,
  },
});

export default Card;
