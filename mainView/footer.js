import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from './sub/colors';
import { WINDOW_HEIGHT } from './sub/dimensions';

export default function Footer() {
  const navigation = useNavigation();
  const footerMenu = [
    {
      image: require('../assets/footer/footerHome.png'),
      name: '홈',
      screen: 'Home',
    },
    {
      image: require('../assets/footer/footerMount.png'),
      name: '산',
      screen: 'Mountain',
    },
    {
      image: require('../assets/footer/footerCommu.png'),
      name: '커뮤니티',
      screen: 'Commu',
    },
    {
      image: require('../assets/footer/footerMy.png'),
      name: '마이',
      screen: 'Mypage',
    },
  ];

  return (
    <View style={styles.footer}>
      {footerMenu.map((menu, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(menu.screen)}
        >
          <Image source={menu.image} style={styles.footerImg} />
          <Text style={styles.footerText}>{menu.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: WINDOW_HEIGHT * 0.1,
    borderTopWidth: 1,
    borderTopColor: colors.Gray,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around', // 각 메뉴 아이템을 균등하게 분배
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItem: {
    alignItems: 'center',
  },
  footerImg: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  footerText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
