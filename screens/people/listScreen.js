import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CustomButton from '../../components/customButton';

const ListScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);

  const loadPeople = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('people');
      setPeople(data ? JSON.parse(data) : []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load people',
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, [loadPeople])
  );

  const deletePerson = (id) => {
    Alert.alert('Delete Person', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const updatedPeople = people.filter((person) => person.key !== id);
            await AsyncStorage.setItem('people', JSON.stringify(updatedPeople));
            setPeople(updatedPeople);
            Toast.show({
              type: 'success',
              text1: 'Person deleted',
            });
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Failed to delete person',
            });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.itemMeta}>{item.relationship}</Text>
      </View>
      <CustomButton
        buttonStyle={styles.deleteButton}
        onPress={() => deletePerson(item.key)}
        text="Delete"
        width={96}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomButton
        buttonStyle={styles.addButton}
        onPress={() => navigation.navigate('PeopleAdd')}
        text="Add Person"
      />
      <FlatList
        contentContainerStyle={people.length === 0 ? styles.emptyListContainer : styles.listContent}
        data={people}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={<Text style={styles.emptyText}>No people added yet.</Text>}
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
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 12,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
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
