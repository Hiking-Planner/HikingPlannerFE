import React from 'react';
import { View, StyleSheet } from 'react-native';
import Footer from './footer';

export default function Commu() {
  return (
    <View style={styles.container}>
      <Footer></Footer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
