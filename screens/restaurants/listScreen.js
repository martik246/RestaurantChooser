import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CustomButton from '../../components/customButton';

const STORAGE_KEY = 'restaurants';

const getRestaurantId = (restaurant) => {
  if (!restaurant) {
    return '';
  }

  return String(restaurant.key ?? restaurant.id ?? '');
};

const normalizeRestaurants = (items) =>
  (Array.isArray(items) ? items : []).map((restaurant, index) => ({
    ...restaurant,
    key: getRestaurantId(restaurant) || `restaurant_${index}`,
  }));

const ListScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);

  const loadRestaurants = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedRestaurants = data ? JSON.parse(data) : [];
      setRestaurants(normalizeRestaurants(parsedRestaurants));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load restaurants',
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRestaurants();
    }, [loadRestaurants])
  );

  const performDeleteRestaurant = async (id) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedRestaurants = data ? JSON.parse(data) : [];
      const normalizedRestaurants = normalizeRestaurants(parsedRestaurants);
      const updatedRestaurants = normalizedRestaurants.filter(
        (restaurant) => getRestaurantId(restaurant) !== String(id)
      );

      if (updatedRestaurants.length === normalizedRestaurants.length) {
        Toast.show({
          type: 'error',
          text1: 'Restaurant was not found for deletion',
        });
        return;
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRestaurants));
      setRestaurants(updatedRestaurants);
      Toast.show({
        type: 'success',
        text1: 'Restaurant deleted',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete restaurant',
      });
    }
  };

  const deleteRestaurant = (id) => {
    if (Platform.OS === 'web') {
      const isConfirmed = typeof window !== 'undefined'
        ? window.confirm('Delete this restaurant?')
        : true;

      if (isConfirmed) {
        performDeleteRestaurant(id);
      }
      return;
    }

    Alert.alert('Delete Restaurant', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          performDeleteRestaurant(id);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {item.cuisine} | Price: {item.price} | Rating: {item.rating}
        </Text>
        <Text style={styles.itemMeta}>{item.phone}</Text>
        <Text style={styles.itemMeta}>{item.address}</Text>
        {!!item.website && <Text style={styles.itemMeta}>{item.website}</Text>}
      </View>
      <CustomButton
        buttonStyle={styles.deleteButton}
        onPress={() => deleteRestaurant(getRestaurantId(item))}
        text="Delete"
        width={96}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomButton
        buttonStyle={styles.addButton}
        onPress={() => navigation.navigate('RestaurantsAdd')}
        text="Add Restaurant"
      />
      <FlatList
        contentContainerStyle={restaurants.length === 0 ? styles.emptyListContainer : styles.listContent}
        data={restaurants}
        keyExtractor={(item, index) => getRestaurantId(item) || `restaurant_${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No restaurants added yet.</Text>}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  deleteButton: {
    alignSelf: 'center',
    backgroundColor: '#d11a2a',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
  },
  itemContent: {
    marginBottom: 12,
  },
  itemMeta: {
    color: '#444',
    marginTop: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default ListScreen;
