import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';

const useUserInfoStore = create(
  persist(
    (set) => ({
      userInfo: {
        userId: '',
        nickname: '',
        isLoggedIn: false,
        phoneNumber: '',
        birth: '',
        introduce: '',
        gender: '',
        profile_image: '', // profile_image 추가
      },
      setUserInfo: (newUserInfo) =>
        set((state) => ({
          userInfo: { ...state.userInfo, ...newUserInfo }, // 기존 상태와 병합
        })),
      clearUserInfo: () =>
        set({
          userInfo: {
            userId: '',
            nickname: '',
            isLoggedIn: false,
            phoneNumber: '',
            birth: '',
            introduce: '',
            gender: '',
            profile_image: '', // 초기화 시 profile_image 포함
          },
        }), // 상태 초기화 함수
    }),
    {
      name: 'userInfoStorage', // 저장되는 이름
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);

export default useUserInfoStore;
