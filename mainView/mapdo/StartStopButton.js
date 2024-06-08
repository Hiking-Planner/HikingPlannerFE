import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from '../sub/colors';

const StartStopButton = ({ tracking, onPress }) => {
  return (
    <TouchableOpacity style={styles.startBtn} onPress={onPress}>
      <FontAwesome
        name={tracking ? 'stop' : 'play'}
        size={40}
        color={colors.snow}
        style={styles.startBtnDesign}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  startBtn: {
    width: 60,
    position: 'absolute',
    backgroundColor: colors.red,
    borderRadius: 50,
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -30 }],
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  startBtnDesign: {
    marginLeft: 0,
  },
});

export default StartStopButton;
