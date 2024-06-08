import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const IconButton = ({ iconName, size = 24, color = 'black', onPress }) => (
  <TouchableOpacity style={styles.buttonTop} onPress={onPress}>
    <Feather name={iconName} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonTop: {
    padding: 5,
  },
});

export default IconButton;
