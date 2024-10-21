import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BACKEND_API_URL } from '@env'; // 환경 변수에서 URL 가져오기

// 기본 axios 인스턴스 생성
export const basicAxios = axios.create({
  baseURL: REACT_APP_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃 설정
});

// 비동기로 access token 가져오기 함수
const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken'); // 토큰 가져오기
    return token || '';
  } catch (error) {
    console.error('토큰 가져오기 오류:', error);
    return '';
  }
};

// 인증이 필요한 axios 인스턴스 생성
export const authAxios = axios.create({
  baseURL: REACT_APP_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터: 요청 전 access token을 헤더에 추가
authAxios.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken(); // 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 토큰 헤더에 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      // 로그아웃 처리 또는 로그인 페이지로 이동 처리
    }
    return Promise.reject(error);
  }
);
