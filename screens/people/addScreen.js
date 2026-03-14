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
import { validateFirstName, validateLastName } from './validators';

const initialPerson = {
  errors: {},
  firstName: '',
  key: '',
  lastName: '',
  relationship: '',
};

const AddScreen = ({ navigation }) => {
  const [person, setPerson] = useState({
    ...initialPerson,
    key: `p_${Date.now()}`,
  });

  const setField = (fieldName, value) => {
    setPerson((current) => ({
      ...current,
      [fieldName]: value,
      errors: {
        ...current.errors,
        [fieldName]: null,
      },
    }));
  };

  const getValidationErrors = () => ({
    firstName: validateFirstName(person.firstName),
    lastName: validateLastName(person.lastName),
    relationship: person.relationship ? null : 'Relationship is required',
  });

  const validateAllFields = () => {
    const errors = getValidationErrors();

    setPerson((current) => ({
      ...current,
      errors,
    }));

    return !Object.values(errors).some((error) => error !== null);
  };

  const savePerson = async () => {
    if (!validateAllFields()) {
      Toast.show({
        type: 'error',
        text1: Object.values(getValidationErrors()).find(Boolean) || 'Please fix the form errors',
      });
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('people');
      const people = existingData ? JSON.parse(existingData) : [];
      people.push({
        firstName: person.firstName.trim(),
        key: person.key,
        lastName: person.lastName.trim(),
        relationship: person.relationship,
      });
      await AsyncStorage.setItem('people', JSON.stringify(people));
      Toast.show({
        type: 'success',
        text1: 'Person saved',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to save person',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.formContainer}>
        <CustomTextInput
          error={person.errors.firstName}
          label="First Name"
          maxLength={50}
          onChangeText={(text) => setField('firstName', text)}
          value={person.firstName}
        />
        <CustomTextInput
          error={person.errors.lastName}
          label="Last Name"
          maxLength={50}
          onChangeText={(text) => setField('lastName', text)}
          value={person.lastName}
        />

        <Text style={styles.fieldLabel}>Relationship</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={person.relationship}
            onValueChange={(value) => setField('relationship', value)}
            style={styles.picker}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="Me" value="Me" />
            <Picker.Item label="Family" value="Family" />
            <Picker.Item label="Friend" value="Friend" />
            <Picker.Item label="Coworker" value="Coworker" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        {person.errors.relationship ? <Text style={styles.errorText}>{person.errors.relationship}</Text> : null}
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
          onPress={savePerson}
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
