import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Picker
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTextInput from '../../components/customTextInput';
import CustomButton from '../../components/customButton';
import Toast from 'react-native-toast-message';
import { validateName, validatePhone, validateAddress, validateWebsite } from './validators';

const AddScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    stars: '3',
    price: '$',
    phone: '',
    address: '',
    website: ''
  });

  const validateForm = () => {
    const nameError = validateName(formData.name);
    if (nameError) {
      Alert.alert('Validation Error', nameError);
      return false;
    }
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      Alert.alert('Validation Error', phoneError);
      return false;
    }
    
    const addressError = validateAddress(formData.address);
    if (addressError) {
      Alert.alert('Validation Error', addressError);
      return false;
    }
    
    const websiteError = validateWebsite(formData.website);
    if (websiteError) {
      Alert.alert('Validation Error', websiteError);
      return false;
    }
    
    return true;
  };

  const saveRestaurant = async () => {
    if (!validateForm()) return;
    
    const newRestaurant = {
      key: Date.now().toString(),
      ...formData
    };
    
    try {
      const data = await AsyncStorage.getItem('restaurants');
      const restaurants = data ? JSON.parse(data) : [];
      restaurants.push(newRestaurant);
      await AsyncStorage.setItem('restaurants', JSON.stringify(restaurants));
      
      Toast.show({
        type: 'success',
        text1: 'Restaurant saved',
        visibilityTime: 2000
      });
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save restaurant');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomTextInput
        label="Restaurant Name"
        stateHolder={{ setState: setFormData }}
        stateFieldName="name"
        maxLength={50}
      />
      
      <CustomTextInput
        label="Cuisine Type"
        stateHolder={{ setState: setFormData }}
        stateFieldName="cuisine"
        maxLength={30}
      />
      
      <CustomTextInput
        label="Phone"
        stateHolder={{ setState: setFormData }}
        stateFieldName="phone"
        maxLength={20}
      />
      
      <CustomTextInput
        label="Address"
        stateHolder={{ setState: setFormData }}
        stateFieldName="address"
        maxLength={100}
      />
      
      <CustomTextInput
        label="Website (optional)"
        stateHolder={{ setState: setFormData }}
        stateFieldName="website"
        maxLength={100}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Stars</Text>
        <Picker
          selectedValue={formData.stars}
          onValueChange={(value) => setFormData({ ...formData, stars: value })}
          style={styles.picker}
        >
          <Picker.Item label="★☆☆☆☆ (1)" value="1" />
          <Picker.Item label="★★☆☆☆ (2)" value="2" />
          <Picker.Item label="★★★☆☆ (3)" value="3" />
          <Picker.Item label="★★★★☆ (4)" value="4" />
          <Picker.Item label="★★★★★ (5)" value="5" />
        </Picker>
      </View>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Price</Text>
        <Picker
          selectedValue={formData.price}
          onValueChange={(value) => setFormData({ ...formData, price: value })}
          style={styles.picker}
        >
          <Picker.Item label="$ (Cheap)" value="$" />
          <Picker.Item label="$$ (Moderate)" value="$$" />
          <Picker.Item label="$$$ (Expensive)" value="$$$" />
          <Picker.Item label="$$$$ (Very Expensive)" value="$$$$" />
        </Picker>
      </View>
      <CustomButton
        text="Save Restaurant"
        onPress={saveRestaurant}
        width="100%"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  pickerContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  }
});

export default AddScreen;