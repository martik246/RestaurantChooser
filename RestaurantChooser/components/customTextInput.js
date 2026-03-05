import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({ 
  label, 
  labelStyle, 
  maxLength, 
  textInputStyle, 
  stateHolder, 
  stateFieldName 
}) => {
  return (
    <View>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.textInput, textInputStyle]}
        maxLength={maxLength}
        onChangeText={(text) => {
          stateHolder.setState({ 
            [stateFieldName]: text 
          });
        }}
      />
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.object,
  maxLength: PropTypes.number,
  textInputStyle: PropTypes.object,
  stateHolder: PropTypes.object.isRequired,
  stateFieldName: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16
  }
});

export default CustomTextInput;