import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import colors from './sub/colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './sub/dimensions';
import { AntDesign } from '@expo/vector-icons';
import IconButton from './sub/IconButton';
import { useNavigation } from '@react-navigation/native';

export default function SearchAdd() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.leftBtn}>
            <IconButton
              iconName='chevron-left'
              onPress={() => navigation.goBack()}
            ></IconButton>
          </View>
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
        </View>
        <View style={styles.recentSearch}>
          <Text style={styles.recentText}>최근 검색어</Text>
          <View style={styles.recentItem}>
            <View style={styles.itemDelete}>
              <IconButton
                iconName='x'
                size={18}
                color={colors.Gray}
              ></IconButton>
            </View>
            <Text style={styles.itemText}>한라산</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
  },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: WINDOW_HEIGHT * 0.04,
  },
  searchSection: {
    width: WINDOW_WIDTH * 0.83,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mintGreen,
    borderRadius: 20,
    paddingHorizontal: 8,
    marginLeft: 10,
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
  recentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentItem: {
    width: 78,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.vectorGray,
    borderWidth: 2,
    borderRadius: 20,
    marginTop: 10,
  },
});
