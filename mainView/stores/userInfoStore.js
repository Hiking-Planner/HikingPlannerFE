import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userInfoStore = create(
  persist(
    (set) => ({
      id: 0,
      name: "",
      isLoggedIn: false,
      setUserInfo: (userInfo) =>
        set((state) => ({
          ...state,
          ...userInfo,
        })),
    }),
    {
      name: "userInfoStorage",
      getStorage: () => AsyncStorage, // React Native의 AsyncStorage 사용
    }
  )
);

export default userInfoStore;
