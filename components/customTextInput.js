import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({
  label,
  labelStyle,
  maxLength,
  textInputStyle,
  stateHolder,
  stateFieldName,
  value,
  onChangeText,
  error,
  ...textInputProps
}) => {
  const handleChange = (text) => {
    if (onChangeText) {
      onChangeText(text);
      return;
    }

    if (stateHolder && typeof stateHolder.setState === 'function' && stateFieldName) {
      stateHolder.setState((prevState) => ({
        ...prevState,
        [stateFieldName]: text,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        maxLength={maxLength}
        onChangeText={handleChange}
        style={[
          styles.textInput,
          error ? styles.textInputError : null,
          textInputStyle,
        ]}
        value={value}
        {...textInputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  maxLength: PropTypes.number,
  textInputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  stateHolder: PropTypes.shape({
    setState: PropTypes.func,
  }),
  stateFieldName: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  error: PropTypes.string,
};

CustomTextInput.defaultProps = {
  labelStyle: undefined,
  maxLength: undefined,
  textInputStyle: undefined,
  stateHolder: undefined,
  stateFieldName: undefined,
  value: '',
  onChangeText: undefined,
  error: null,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginLeft: 10,
  },
  textInput: {
    borderColor: '#c0c0c0',
    borderRadius: 8,
    borderWidth: 2,
    fontSize: 16,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInputError: {
    borderColor: '#d11a2a',
  },
  errorText: {
    color: '#d11a2a',
    marginLeft: 10,
    marginTop: 4,
  },
});

export default CustomTextInput;
