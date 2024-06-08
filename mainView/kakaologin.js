import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });
const KAKAO_REST_API_KEY = '8c0d60b0bdb70acd643345805971b0f6';

export default function Kakaologin({ navigation }) {
  useEffect(() => {
    const handleKakaoLogin = async () => {
      const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

      const result = await AuthSession.startAsync({ authUrl });
      
      if (result.type === 'success') {
        const code = result.params.code;
        getToken(code);
      }
    };

    const getToken = async (code) => {
      try {
        const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
          params: {
            grant_type: 'authorization_code',
            client_id: KAKAO_REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code,
          },
        });
        const { access_token } = response.data;
        getUserInfo(access_token);
      } catch (error) {
        console.error(error);
      }
    };

    const getUserInfo = async (token) => {
      try {
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigation.navigate('Home', { userInfo: response.data });
      } catch (error) {
        console.error(error);
      }
    };

    handleKakaoLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
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
