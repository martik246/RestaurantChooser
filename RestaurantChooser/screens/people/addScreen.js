import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTextInput from '../../components/customTextInput';
import CustomButton from '../../components/customButton';
import Toast from 'react-native-toast-message';
import { Picker } from 'react-native';
import { validateFirstName, validateLastName } from './validators.js';

const AddScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: 'Friend'
  });

  const validateForm = () => {
    const firstNameError = validateFirstName(formData.firstName);
    if (firstNameError) {
      Alert.alert('Validation Error', firstNameError);
      return false;
    }
    
    const lastNameError = validateLastName(formData.lastName);
    if (lastNameError) {
      Alert.alert('Validation Error', lastNameError);
      return false;
    }
    
    return true;
  };

  const savePerson = async () => {
    if (!validateForm()) return;
    
    const newPerson = {
      key: Date.now().toString(),
      ...formData
    };
    
    try {
      const data = await AsyncStorage.getItem('people');
      const people = data ? JSON.parse(data) : [];
      people.push(newPerson);
      await AsyncStorage.setItem('people', JSON.stringify(people));
      
      Toast.show({
        type: 'success',
        text1: 'Person saved',
        visibilityTime: 2000
      });
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save person');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomTextInput
        label="First Name"
        stateHolder={{ setState: setFormData }}
        stateFieldName="firstName"
        maxLength={50}
      />
      
      <CustomTextInput
        label="Last Name"
        stateHolder={{ setState: setFormData }}
        stateFieldName="lastName"
        maxLength={50}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Relationship</Text>
        <Picker
          selectedValue={formData.relationship}
          onValueChange={(value) => setFormData({ ...formData, relationship: value })}
          style={styles.picker}
        >
          <Picker.Item label="Me" value="Me" />
          <Picker.Item label="Family" value="Family" />
          <Picker.Item label="Friend" value="Friend" />
          <Picker.Item label="Coworker" value="Coworker" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>
      
      <CustomButton
        text="Save Person"
        onPress={savePerson}
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