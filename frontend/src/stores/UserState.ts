import { defineStore } from "pinia";
import type { User } from "@/types/User";
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { showToast } from "@/utils/Toast";
import { goToHome } from "@/utils/ChangeRoute";

const USER_KEY = "userInfo";

function loadUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? (JSON.parse(data) as User) : null;
}

export const useUserState = defineStore("user", {
  state: () => ({
    userInfo: loadUser(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.userInfo,
    isAdmin: (state) => state.userInfo?.userType === "ADMIN",
  },
  actions: {
    setUser(user: User) {
      this.userInfo = user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem("username", user.name);
      goToHome();
    },
    async logout() {
      this.userInfo = null;
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("username");

      const requestInfo: RequestInformation = {
        method: "POST",
        path: "users/logout",
      };

      const response = await sendBackEndRequest(requestInfo);
      if (response.success) {
        showToast("Logged out successfully", "success");
      } else {
        showToast("Logout failed", "error");
      }
    },
  },
});
