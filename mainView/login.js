import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import colors from './sub/colors';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const passwordInputRef = useRef(null);

  const signIn = async () => {
    try {
      const response = await axios.post(
        'http://ec2-3-143-125-20.us-east-2.compute.amazonaws.com:8080/api/v1/auth/sign-in',
        {
          id: id,
          password: password,
        }
      );

      // 로그인 성공 시 메인 화면으로 이동
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
      <TextInput
        style={styles.input}
        mode='outlined'
        value={id}
        onChangeText={setId}
        placeholder='아이디'
        returnKeyType='next'
        onSubmitEditing={() =>
          passwordInputRef.current && passwordInputRef.current.focus()
        }
      />
      <TextInput
        ref={passwordInputRef}
        style={styles.input}
        mode='outlined'
        value={password}
        onChangeText={setPassword}
        placeholder='비밀번호'
        secureTextEntry
        returnKeyType='done'
        onSubmitEditing={signIn}
      />
      <Button mode='contained' onPress={signIn} style={styles.loginButton}>
        로그인
      </Button>
      <Button
        mode='contained'
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
