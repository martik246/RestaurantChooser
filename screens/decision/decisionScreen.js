import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const PEOPLE_STORAGE_KEY = 'people';
const RESTAURANTS_STORAGE_KEY = 'restaurants';

const getDecisionImage = () =>
  Platform.OS === 'ios'
    ? require('../../assets/its-decision-time.ios.png')
    : require('../../assets/its-decision-time.android.png');

export default function DecisionScreen({ navigation }) {
  const startDecisionFlow = async () => {
    try {
      // Part 2 depends on Part 1 data, so we verify both collections before starting.
      const peopleData = await AsyncStorage.getItem(PEOPLE_STORAGE_KEY);
      const restaurantsData = await AsyncStorage.getItem(RESTAURANTS_STORAGE_KEY);

      const people = peopleData ? JSON.parse(peopleData) : [];
      const restaurants = restaurantsData ? JSON.parse(restaurantsData) : [];

      if (!people.length) {
        Alert.alert(
          "That ain't gonna work, chief",
          'You need to add at least one person before making a decision.'
        );
        return;
      }

      if (!restaurants.length) {
        Alert.alert(
          "That ain't gonna work, chief",
          'You need to add at least one restaurant before making a decision.'
        );
        return;
      }

      navigation.navigate('WhosGoingScreen');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to start the decision process',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.headline}>It&apos;s Decision Time</Text>
        <Text style={styles.description}>
          Tap the image below to start choosing a restaurant for your group.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={startDecisionFlow}
          style={styles.imageButton}
        >
          <Image
            resizeMode="contain"
            source={getDecisionImage()}
            style={styles.heroImage}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  description: {
    color: '#555',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  headline: {
    fontSize: 30,
    textAlign: 'center',
  },
  heroImage: {
    height: 320,
    width: '100%',
  },
  imageButton: {
    marginTop: 30,
    width: '100%',
  },
  innerContainer: {
    alignItems: 'center',
  },
});
