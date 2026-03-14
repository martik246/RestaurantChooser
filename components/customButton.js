import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({
  text,
  onPress,
  buttonStyle,
  textStyle,
  width,
  disabled,
}) => (
  <TouchableOpacity
    activeOpacity={disabled ? 1 : 0.8}
    disabled={disabled}
    hitSlop={{ bottom: 6, left: 6, right: 6, top: 6 }}
    onPress={onPress}
    style={[
      styles.button,
      width ? { width } : null,
      disabled ? styles.buttonDisabled : null,
      buttonStyle,
    ]}
  >
    <Text style={[styles.text, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
};

CustomButton.defaultProps = {
  buttonStyle: undefined,
  textStyle: undefined,
  width: undefined,
  disabled: false,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#c0c0c0',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
