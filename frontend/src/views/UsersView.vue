<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import UserForm from "@/components/UserForm.vue";
import type { User } from "@/types/User";
import { showToast } from "@/utils/Toast";
import { ref } from "vue";

const users = ref<User[]>([]);

const getUsers = async () => {
  try {
    const requestInfo: RequestInformation = {
      path: "users/",
      method: "GET",
    };

    const { success, data } = await sendBackEndRequest(requestInfo);

    if (success && data) {
      users.value = data;
    } else {
      showToast(data.error.message || "Failed to fetch users", "error");
    }
  } catch (error) {
    showToast("Error fetching users:", "error");
  }
};

const setStatus = async (email: string, status: string) => {
  try {
    const requestInfo: RequestInformation = {
      path: `users/update-user-status`,
      method: "PUT",
      data: { email, status },
    };

    const response = await sendBackEndRequest(requestInfo);

    if (response.success) {
      showToast(
        response.message || "User status updated successfully",
        "success"
      );
      getUsers();
    } else {
      showToast(
        response.data.error.message || "Failed to update user status",
        "error"
      );
    }
  } catch (error) {
    showToast("Error updating user status:", "error");
  }
};

getUsers();
</script>

<template>
  <UserForm />
  <v-btn>Add user</v-btn>
  <div>
    <h1>Users</h1>
    <ul>
      <li v-for="user in users" :key="user.email">
        {{ user.name }} | {{ user.lastName }} | {{ user.email }} |
        {{ user.userType }} | {{ user.status }}
        <div>
          <v-btn>Edit</v-btn>
          <v-btn
            v-if="user.status === 'NOT_ACTIVE'"
            @click="setStatus(user.email, 'ACTIVE')"
            >Activate</v-btn
          >
          <v-btn
            v-if="user.status === 'ACTIVE'"
            @click="setStatus(user.email, 'NOT_ACTIVE')"
            >Deactivate</v-btn
          >
        </div>
      </li>
    </ul>
  </div>
</template>
