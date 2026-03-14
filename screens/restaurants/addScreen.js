import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import CustomButton from '../../components/customButton';
import CustomTextInput from '../../components/customTextInput';
import {
  validateAddress,
  validateName,
  validatePhone,
  validateWebsite,
} from './validators';

const initialRestaurant = {
  address: '',
  cuisine: '',
  delivery: '',
  errors: {},
  key: '',
  name: '',
  phone: '',
  price: '',
  rating: '',
  website: '',
};

const AddScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState({
    ...initialRestaurant,
    key: `r_${Date.now()}`,
  });

  const setField = (fieldName, value) => {
    setRestaurant((current) => ({
      ...current,
      [fieldName]: value,
      errors: {
        ...current.errors,
        [fieldName]: null,
      },
    }));
  };

  const getValidationErrors = () => ({
    address: validateAddress(restaurant.address),
    cuisine: restaurant.cuisine ? null : 'Cuisine is required',
    delivery: restaurant.delivery ? null : 'Delivery selection is required',
    name: validateName(restaurant.name),
    phone: validatePhone(restaurant.phone),
    price: restaurant.price ? null : 'Price is required',
    rating: restaurant.rating ? null : 'Rating is required',
    website: validateWebsite(restaurant.website),
  });

  const validateAllFields = () => {
    const errors = getValidationErrors();

    setRestaurant((current) => ({
      ...current,
      errors,
    }));

    return !Object.values(errors).some((error) => error !== null);
  };

  const saveRestaurant = async () => {
    if (!validateAllFields()) {
      Toast.show({
        type: 'error',
        text1: Object.values(getValidationErrors()).find(Boolean) || 'Please fix the form errors',
      });
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('restaurants');
      const restaurants = existingData ? JSON.parse(existingData) : [];
      restaurants.push({
        address: restaurant.address.trim(),
        cuisine: restaurant.cuisine,
        delivery: restaurant.delivery,
        key: restaurant.key,
        name: restaurant.name.trim(),
        phone: restaurant.phone.trim(),
        price: restaurant.price,
        rating: restaurant.rating,
        website: restaurant.website.trim(),
      });
      await AsyncStorage.setItem('restaurants', JSON.stringify(restaurants));
      Toast.show({
        type: 'success',
        text1: 'Restaurant saved',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to save restaurant',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.formContainer}>
        <CustomTextInput
          error={restaurant.errors.name}
          label="Name"
          maxLength={50}
          onChangeText={(text) => setField('name', text)}
          value={restaurant.name}
        />

        <Text style={styles.fieldLabel}>Cuisine</Text>
        <View style={styles.pickerContainer}>
          <Picker
            prompt="Cuisine"
            selectedValue={restaurant.cuisine}
            onValueChange={(value) => setField('cuisine', value)}
            style={styles.picker}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="American" value="American" />
            <Picker.Item label="Chinese" value="Chinese" />
            <Picker.Item label="Italian" value="Italian" />
            <Picker.Item label="Mexican" value="Mexican" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        {restaurant.errors.cuisine ? <Text style={styles.errorText}>{restaurant.errors.cuisine}</Text> : null}

        <Text style={styles.fieldLabel}>Price</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={restaurant.price}
            onValueChange={(value) => setField('price', value)}
            style={styles.picker}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
          </Picker>
        </View>
        {restaurant.errors.price ? <Text style={styles.errorText}>{restaurant.errors.price}</Text> : null}

        <Text style={styles.fieldLabel}>Rating</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={restaurant.rating}
            onValueChange={(value) => setField('rating', value)}
            style={styles.picker}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
          </Picker>
        </View>
        {restaurant.errors.rating ? <Text style={styles.errorText}>{restaurant.errors.rating}</Text> : null}

        <CustomTextInput
          error={restaurant.errors.phone}
          keyboardType="phone-pad"
          label="Phone"
          maxLength={20}
          onChangeText={(text) => setField('phone', text)}
          value={restaurant.phone}
        />
        <CustomTextInput
          error={restaurant.errors.address}
          label="Address"
          maxLength={80}
          onChangeText={(text) => setField('address', text)}
          value={restaurant.address}
        />
        <CustomTextInput
          autoCapitalize="none"
          error={restaurant.errors.website}
          keyboardType="url"
          label="Website"
          maxLength={80}
          onChangeText={(text) => setField('website', text)}
          value={restaurant.website}
        />

        <Text style={styles.fieldLabel}>Delivery?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={restaurant.delivery}
            onValueChange={(value) => setField('delivery', value)}
            style={styles.picker}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>
        {restaurant.errors.delivery ? <Text style={styles.errorText}>{restaurant.errors.delivery}</Text> : null}
      </View>

      <View style={styles.buttonRow}>
        <CustomButton
          buttonStyle={styles.cancelButton}
          onPress={() => navigation.goBack()}
          text="Cancel"
          width="44%"
        />
        <CustomButton
          buttonStyle={styles.saveButton}
          onPress={saveRestaurant}
          text="Save"
          width="44%"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: '#7a7a7a',
  },
  errorText: {
    color: '#d11a2a',
    marginBottom: 10,
    marginLeft: 10,
  },
  fieldLabel: {
    marginLeft: 10,
  },
  formContainer: {
    width: '96%',
  },
  picker: {
    ...Platform.select({
      android: {},
      ios: {
        borderColor: '#c0c0c0',
        borderRadius: 8,
        borderWidth: 2,
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 4,
        width: '96%',
      },
    }),
  },
  pickerContainer: {
    ...Platform.select({
      android: {
        borderColor: '#c0c0c0',
        borderRadius: 8,
        borderWidth: 2,
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 4,
        width: '96%',
      },
      ios: {},
    }),
  },
  saveButton: {
    backgroundColor: '#2e8b57',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 20,
    width: '100%',
  },
});

export default AddScreen;
