import React, { useEffect, useState } from 'react';
import {
  Alert,
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

const RESTAURANTS_STORAGE_KEY = 'restaurants';

const matchesDeliveryPreference = (restaurantDelivery, selectedDelivery) => {
  if (!selectedDelivery) {
    return true;
  }

  // Support both Yes/No strings from the form and boolean-style values from the guide.
  if (typeof restaurantDelivery === 'boolean') {
    return restaurantDelivery === (selectedDelivery === 'Yes');
  }

  return String(restaurantDelivery).toLowerCase() === selectedDelivery.toLowerCase();
};

export default function PreFiltersScreen({ navigation, route }) {
  const { participants = [] } = route.params ?? {};

  const [restaurants, setRestaurants] = useState([]);
  const [cuisine, setCuisine] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [delivery, setDelivery] = useState('');

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const restaurantsData = await AsyncStorage.getItem(RESTAURANTS_STORAGE_KEY);
        const parsedRestaurants = restaurantsData ? JSON.parse(restaurantsData) : [];
        setRestaurants(parsedRestaurants);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to load restaurants for filtering',
        });
      }
    };

    loadRestaurants();
  }, []);

  const handleNext = () => {
    // Every filter is optional, so selecting "Any" skips that condition.
    const filteredRestaurants = restaurants.filter((restaurant) => {
      const matchesCuisine = !cuisine || restaurant.cuisine === cuisine;
      const matchesPrice = !price || Number(restaurant.price) <= Number(price);
      const matchesRating = !rating || Number(restaurant.rating) >= Number(rating);
      const matchesDelivery = matchesDeliveryPreference(restaurant.delivery, delivery);

      return matchesCuisine && matchesPrice && matchesRating && matchesDelivery;
    });

    if (!filteredRestaurants.length) {
      Alert.alert(
        'No Matches',
        'No restaurants match the selected criteria. Please change the filters and try again.'
      );
      return;
    }

    navigation.navigate('ChoiceScreen', {
      participants,
      restaurants: filteredRestaurants,
    });
  };

  return (
    <ScrollView style={styles.preFiltersContainer}>
      <View style={styles.preFiltersInnerContainer}>
        <View style={styles.preFiltersScreenFormContainer}>
          <View style={styles.preFiltersHeadlineContainer}>
            <Text style={styles.preFiltersHeadline}>Pre-Filters</Text>
          </View>

          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              onValueChange={(value) => setCuisine(value)}
              selectedValue={cuisine}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="Italian" value="Italian" />
              <Picker.Item label="Chinese" value="Chinese" />
              <Picker.Item label="Indian" value="Indian" />
              <Picker.Item label="Mexican" value="Mexican" />
              <Picker.Item label="American" value="American" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Max Price</Text>
          <View style={styles.pickerContainer}>
            <Picker
              onValueChange={(value) => setPrice(value)}
              selectedValue={price}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="$" value="1" />
              <Picker.Item label="$$" value="2" />
              <Picker.Item label="$$$" value="3" />
              <Picker.Item label="$$$$" value="4" />
              <Picker.Item label="$$$$$" value="5" />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Min Rating</Text>
          <View style={styles.pickerContainer}>
            <Picker
              onValueChange={(value) => setRating(value)}
              selectedValue={rating}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="1 Star" value="1" />
              <Picker.Item label="2 Stars" value="2" />
              <Picker.Item label="3 Stars" value="3" />
              <Picker.Item label="4 Stars" value="4" />
              <Picker.Item label="5 Stars" value="5" />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Delivery</Text>
          <View style={styles.pickerContainer}>
            <Picker
              onValueChange={(value) => setDelivery(value)}
              selectedValue={delivery}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>

          <CustomButton
            onPress={handleNext}
            text="Next"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    marginLeft: 10,
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
  preFiltersContainer: {},
  preFiltersHeadline: {
    fontSize: 30,
  },
  preFiltersHeadlineContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  preFiltersInnerContainer: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
    width: '100%',
  },
  preFiltersScreenFormContainer: {
    width: '96%',
  },
});
