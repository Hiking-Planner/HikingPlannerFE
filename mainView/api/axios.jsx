import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

// 기본 axios 인스턴스 생성
export const basicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // React Native에서는 withCredentials 사용 X
});

// 비동기로 access token 가져오기 함수
const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token || '';
  } catch (error) {
    console.error('Failed to fetch access token:', error);
    return '';
  }
};

// 인증이 필요한 axios 인스턴스 생성
export const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // React Native 환경에 맞게 설정
});

// 요청 인터셉터: 요청 전 access token을 헤더에 추가
authAxios.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 잘 안돼서 일단 보류