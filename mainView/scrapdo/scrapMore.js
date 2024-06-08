import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import IconButton from '../sub/IconButton';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import Route, { scrapedRoutes } from './route';
import { useNavigation } from '@react-navigation/native';

export default function ScrapMore() {
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
          <Text style={styles.headerTitle}>나의 경로</Text>
          <View style={styles.btns}>
            <IconButton
              iconName='search'
              onPress={() => navigation.navigate('SearchAdd')}
            />
            <IconButton iconName='bell' />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Route routes={scrapedRoutes} />
        </ScrollView>
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
    marginTop: WINDOW_HEIGHT * 0.035,
  },
  leftBtn: {
    flex: 2,
  },
  headerTitle: {
    flex: 7,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btns: { flexDirection: 'row', flex: 2 },
});
