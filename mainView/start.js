import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import colors from './sub/colors';

export default function Start({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={styles.textlogo}>
        Hiking
        {'\n'}
        Planner
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      {/*
      <TouchableOpacity
        onPress={() => navigation.navigate('Kakaologin')}
      >
        <Image
          source={require('../assets/kakao_login.png')}
          style={styles.kakaoButton}
          resizeMode='contain'
        />
      </TouchableOpacity>  -> 카카오 로그인 기능이 잘 안돼서 일단 보류
  */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  textlogo: {
    textAlign: 'center',
    fontSize: 45,
    fontWeight: '900',
    color: colors.mintGreen,
    marginBottom: 20,
  },
  button: {
    width: 200,
    padding: 15,
    borderRadius: 25,
    backgroundColor: colors.mintGreen,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  kakaoButton: {
    width: 300, // 버튼의 가로 크기 조절
    height: 200, // 버튼의 세로 크기 조절
  },
});
