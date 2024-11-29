import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  id: number;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: async (token: string, user: User) => {
    try {
      // 使用 AsyncStorage 替代 SecureStore
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      // 更新状态
      set({ token, user });
    } catch (error) {
      console.error("Failed to save auth data:", error);
      throw error;
    }
  },
  logout: async () => {
    try {
      // 清除存储的认证数据
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      // 重置状态
      set({ token: null, user: null });
      // 退出后跳转到登录页
      router.replace("/login");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
      throw error;
    }
  },
}));
