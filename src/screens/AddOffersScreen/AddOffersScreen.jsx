import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const AddOffersScreen = () => {
  const [category, setCategory] = useState('Hair Cut');
  const [serviceName, setServiceName] = useState('Style Hair Cut');
  const [regularPrice, setRegularPrice] = useState('$25');
  const [offerPrice, setOfferPrice] = useState('$25');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.imgur.com/VPROSjQ.png' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add Offers</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Categories</Text>
          <TouchableOpacity style={styles.pickerContainer}>
            <Text style={styles.pickerText}>{category}</Text>
            <Icon name="chevron-down" size={20} color="#888" />
          </TouchableOpacity>

          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            value={serviceName}
            onChangeText={setServiceName}
          />

          <Text style={styles.label}>Regular Price</Text>
          <TextInput
            style={styles.input}
            value={regularPrice}
            onChangeText={setRegularPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Offer Price</Text>
          <TextInput
            style={styles.input}
            value={offerPrice}
            onChangeText={setOfferPrice}
            keyboardType="numeric"
          />

          <View style={styles.uploadLabelContainer}>
            <Text style={styles.label}>Upload Image</Text>
            <Text style={styles.subLabel}>(Mix image size 90x90)</Text>
          </View>
          <TouchableOpacity style={styles.uploadBox}>
            <Icon name="image-outline" size={50} color="#ccc" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>ADD OFFER</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 120,
    justifyContent: 'center',
    paddingTop: 20,
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 0, 128, 0.6)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  form: {
    paddingHorizontal: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  uploadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddOffersScreen;
