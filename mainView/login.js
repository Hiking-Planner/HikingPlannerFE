import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image, Text, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import colors from './sub/colors';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const passwordInputRef = useRef(null); // 비밀번호 입력 필드 참조
  const loginButtonRef = useRef(null); // 로그인 버튼 참조

  // 로그인 요청 함수
  const signIn = async () => {
    try {
      const response = await axios.post(
        'http://3.34.159.30:8080/api/v1/auth/sign-in',
        { id: id, password: password }
      );
      // 로그인 성공 시 홈 화면으로 이동
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('로그인 실패', '사용자 정보가 일치하지 않습니다!');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.textLogo}>Hiking Planner</Text>

      {/* 아이디 입력 필드 */}
      <TextInput
        style={styles.input}
        mode="outlined"
        value={id}
        onChangeText={setId}
        placeholder="아이디"
        returnKeyType="next" // 키보드에서 '다음' 버튼 표시
        onSubmitEditing={() => passwordInputRef.current?.focus()} // '다음'을 누르면 비밀번호 필드로 이동
      />

      {/* 비밀번호 입력 필드 */}
      <TextInput
        ref={passwordInputRef}
        style={styles.input}
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry
        returnKeyType="done" // 키보드에서 '완료' 버튼 표시
        onSubmitEditing={() => {
          Keyboard.dismiss(); // 키보드 닫기
          signIn(); // '완료' 누르면 로그인 요청
        }}
      />

      {/* 로그인 버튼 */}
      <Button
        mode="contained"
        onPress={signIn}
        style={styles.loginButton}
        ref={loginButtonRef} // 버튼 참조
      >
        로그인
      </Button>

      {/* 회원가입 버튼 */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Signup')}
        style={styles.signupButton}
      >
        회원가입
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  textLogo: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.mintGreen,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    width: '80%',
    height: 45,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.mintGreen,
    marginBottom: 10,
  },
  signupButton: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.mintGreen,
    marginBottom: 10,
  },
});

export default Login;
