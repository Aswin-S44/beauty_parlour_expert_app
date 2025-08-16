import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Reviews = () => {
  const reviews = [
    {
      name: 'Jonson Wiliam',
      time: '1 day ago',
      rating: 4,
      comment:
        'Contrary to popular besimp and world class lyrandom text. It has roots',
    },
    {
      name: 'Shikha Das',
      time: '3 month ago',
      rating: 4,
      comment:
        'Contrary to popular besimp and world class lyrandom text. It has roots',
    },
    {
      name: 'Fiza Kubila',
      time: '2 month ago',
      rating: 4,
      comment:
        'Contrary to popular besimp and world class lyrandom text. It has roots',
    },
  ];

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={16}
          color={i <= rating ? '#FFD700' : '#CCCCCC'}
        />,
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.overallRating}>
        <Text style={styles.overallText}>4.9 Overall Rating</Text>
        <View style={styles.starsContainer}>
          {renderStars(5)}
          <Text style={styles.ratingCount}>(120)</Text>
        </View>
        <View style={styles.ratingBreakdown}>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Good</Text>
            <Text style={styles.ratingValue}>(5)</Text>
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Service</Text>
          </View>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>Price</Text>
          </View>
        </View>
        <Text style={styles.reviewCount}>17 of 70</Text>
      </View>

      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewerName}>{review.name}</Text>
            <Text style={styles.reviewTime}>{review.time}</Text>
          </View>
          <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  overallRating: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  overallText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingCount: {
    marginLeft: 10,
    color: '#666',
  },
  ratingBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    color: '#666',
  },
  ratingValue: {
    marginLeft: 5,
    color: '#666',
  },
  reviewCount: {
    color: '#666',
  },
  reviewCard: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewerName: {
    fontWeight: 'bold',
  },
  reviewTime: {
    color: '#666',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewComment: {
    color: '#666',
    lineHeight: 20,
  },
});

export default Reviews;
