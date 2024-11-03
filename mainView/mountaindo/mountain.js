import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import IconButton from '../sub/IconButton';
import AllMountain from './allMountains';
import CategoryMountain from './categorymount';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import Footer from '../footer';
import { useNavigation } from '@react-navigation/native';

export default function Mountain() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.btns}>
          <IconButton
            iconName='search'
            onPress={() => navigation.navigate('SearchAdd')}
          />
          <IconButton
            iconName='bookmark'
            onPress={() => navigation.navigate('ScrapMore')}
          />
          <IconButton iconName='bell' />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mountainScroll}
        >
          <AllMountain></AllMountain>
          <CategoryMountain></CategoryMountain>
        </ScrollView>
        <Footer></Footer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  wrapper: {
    flex: 1,
    paddingBottom: WINDOW_HEIGHT * 0.1,
  },
  btns: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: WINDOW_HEIGHT * 0.025,
  },
});
