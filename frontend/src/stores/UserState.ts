import { defineStore } from "pinia";
import type { User } from "@/types/User";

const USER_KEY = "userInfo";

function loadUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) as User : null;
}

export const useUserState = defineStore("user", {
  state: () => ({
    userInfo: loadUser(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.userInfo,
  },
  actions: {
    setUser(user: User) {
      this.userInfo = user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout() {
      this.userInfo = null;
      localStorage.removeItem(USER_KEY);
    },
  },
});
