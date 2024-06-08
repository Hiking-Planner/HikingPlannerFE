import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from './sub/colors';
import { WINDOW_HEIGHT } from './sub/dimensions';
import { AntDesign } from '@expo/vector-icons';

export default function Search() {
  return (
    <View style={styles.searchSection}>
      <TextInput
        style={styles.searchInput}
        placeholder='어느 산을 찾으시나요?'
        placeholderTextColor={colors.Gray}
      />
      <TouchableOpacity style={styles.searchbtn}>
        <AntDesign name='search1' size={24} color='black' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    height: WINDOW_HEIGHT * 0.06,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mintGreen,
    borderRadius: 20,
    paddingRight: 10,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 9,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRadius: 20,
  },
  searchbtn: {
    flex: 1,
  },
});
