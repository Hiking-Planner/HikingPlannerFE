import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../sub/colors';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import IconButton from '../sub/IconButton';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.textLogo}>커뮤니티</Text>
      <View style={styles.btns}>
        <IconButton iconName='search' />
        <IconButton iconName='bookmark' />
        <IconButton iconName='bell' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: WINDOW_HEIGHT * 0.025,
  },
  textLogo: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 10,
  },
  btns: {
    flexDirection: 'row',
  },
});
