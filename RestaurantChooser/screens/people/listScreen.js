import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/customButton';
import Toast from 'react-native-toast-message';

const ListScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      const data = await AsyncStorage.getItem('people');
      if (data) {
        setPeople(JSON.parse(data));
      }
    };
    fetchPeople();
  }, []);

  const deletePerson = async (id) => {
    Alert.alert(
      'Delete Person',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            const updated = people.filter(p => p.key !== id);
            await AsyncStorage.setItem('people', JSON.stringify(updated));
            setPeople(updated);
            Toast.show({
              type: 'error',
              text1: 'Person deleted',
              visibilityTime: 2000
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomButton
        text="Add Person"
        onPress={() => navigation.navigate('PeopleAdd')}
      />
      <FlatList
        data={people}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.personItem}>
            <Text style={styles.text}>
              {item.firstName} {item.lastName} ({item.relationship})
            </Text>
            <CustomButton
              text="Delete"
              onPress={() => deletePerson(item.key)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  personItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  text: {
    fontSize: 18
  }
});

export default ListScreen;