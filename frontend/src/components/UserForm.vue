<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { showToast } from "@/utils/Toast";

const props = defineProps({
  email: String,
  name: String,
  lastName: String,
  isNew: Boolean,
});

const isNew = props.isNew || false;

const form = reactive({
  email: "",
  name: "",
  lastName: "",
  status: "",
  password: "",
});

onMounted(() => {
  form.email = props.email ? props.email : "";
  form.name = props.name ? props.name : "";
  form.lastName = props.lastName ? props.lastName : "";
});

const createUser = async () => {
  try {
    const requestInfo: RequestInformation = {
      path: `users/create`,
      method: "POST",
      data: { email: form.email, status: form.status },
    };

    const response = await sendBackEndRequest(requestInfo);

    if (response.success) {
      showToast(response.message || "User created successfully", "success");
    } else {
      showToast(
        response.data.error.message || "Failed to create user",
        "error"
      );
    }
  } catch (error) {
    showToast("Error creating user:", "error");
  }
};

const updateUser = async () => {
  try {
    const requestInfo: RequestInformation = {
      path: "users/",
      method: "PUT",
      data: { status: form.status },
    };

    const response = await sendBackEndRequest(requestInfo);

    if (response.success) {
      showToast(
        response.message || "User status updated successfully",
        "success"
      );
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
</script>

<template>
  <div
    class="absolute flex w-screen h-screen bg z-500 bg-fixed top-0 left-0"
    @click="$emit('close')"
  >
    <div class="flex items-center justify-center w-full h-full z-600">
      <v-card
        class="mx-4 pa-6 cursor-default"
        max-width="500"
        width="100%"
        @click.stop
        :ripple="false"
      >
        <v-card-title class="text-h5 text-center mb-4">
          Create New Event
        </v-card-title>

        <v-text-field
          v-model="form.name"
          label="User Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="form.lastName"
          label="User Last Name"
          required
        ></v-text-field>
        <v-text-field
          v-model="form.email"
          label="User Email"
          type="email"
          :disabled="!isNew"
          required
        ></v-text-field>
        <v-text-field
          v-if="isNew"
          v-model="form.password"
          label="User Password"
          type="password"
          required
        ></v-text-field>
        <v-btn @click="isNew ? createUser() : updateUser()">{{
          isNew ? "Create User" : "Update User"
        }}</v-btn>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
