import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from './sub/colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import IconButton from './sub/IconButton';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.textLogo}>Hiking Planner</Text>
      <View style={styles.btns}>
        <IconButton
          iconName='bookmark'
          onPress={() => navigation.navigate('ScrapMore')}
        />
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
  logo: {
    width: WINDOW_WIDTH * 0.12,
    height: '100%', // 로고의 높이를 header의 높이와 동일하게 설정
    resizeMode: 'contain',
  },
  textLogo: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    color: colors.mintGreen,
    marginLeft: 10,
  },
  btns: {
    flexDirection: 'row',
  },
});
