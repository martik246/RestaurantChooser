import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../components/customButton';

const PEOPLE_STORAGE_KEY = 'people';

export default function WhosGoingScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState([]);

  const loadPeople = useCallback(async () => {
    try {
      const peopleData = await AsyncStorage.getItem(PEOPLE_STORAGE_KEY);
      const parsedPeople = peopleData ? JSON.parse(peopleData) : [];

      setPeople(parsedPeople);
      // This array mirrors the list order and stores the checkbox state for each row.
      setSelected(parsedPeople.map(() => false));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load people for this decision',
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, [loadPeople])
  );

  useEffect(() => {
    if (BackHandler?.addEventListener == null) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Leave decision flow?',
        'Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => navigation.goBack(),
          },
        ]
      );

      return true;
    });

    return () => subscription.remove();
  }, [navigation]);

  const toggleSelection = (index) => {
    setSelected((current) => {
      const updatedSelected = [...current];
      updatedSelected[index] = !updatedSelected[index];
      return updatedSelected;
    });
  };

  const handleNext = () => {
    // Only selected people continue, and each starts with an unused veto.
    const selectedParticipants = people
      .map((person, index) => (selected[index] ? { ...person, vetoed: 'no' } : null))
      .filter(Boolean);

    if (!selectedParticipants.length) {
      Alert.alert('Select People', 'Please choose at least one person.');
      return;
    }

    navigation.navigate('PreFiltersScreen', {
      participants: selectedParticipants,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => toggleSelection(index)}
      style={styles.personRow}
    >
      <Checkbox
        color={selected[index] ? '#007bff' : undefined}
        onValueChange={() => toggleSelection(index)}
        style={styles.checkbox}
        value={!!selected[index]}
      />
      <View style={styles.personTextContainer}>
        <Text style={styles.personName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.personRelationship}>{item.relationship}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Who&apos;s Going?</Text>

      <FlatList
        contentContainerStyle={people.length === 0 ? styles.emptyList : styles.listContent}
        data={people}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No people found. Please add people first.</Text>
        }
        renderItem={renderItem}
        style={styles.list}
      />

      <CustomButton
        onPress={handleNext}
        text="Next"
        width="94%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    marginRight: 14,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  headline: {
    fontSize: 30,
    marginBottom: 20,
  },
  list: {
    width: '94%',
  },
  listContent: {
    paddingBottom: 20,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  personRelationship: {
    color: '#555',
    marginTop: 2,
  },
  personRow: {
    alignItems: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 6,
    paddingBottom: 12,
    paddingTop: 12,
  },
  personTextContainer: {
    flex: 1,
  },
});
