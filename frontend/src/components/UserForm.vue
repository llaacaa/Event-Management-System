<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { showToast } from "@/utils/Toast";
import type { User } from "@/types/User";

const props = defineProps<{
  user?: User | null;
  isNew: boolean;
}>();

const emit = defineEmits<{
  close: [];
  userSaved: [];
}>();

const form = reactive({
  email: "",
  name: "",
  lastName: "",
  status: "ACTIVE",
  password: "",
});

const isLoading = ref(false);

onMounted(() => {
  if (props.user && !props.isNew) {
    form.email = props.user.email;
    form.name = props.user.name;
    form.lastName = props.user.lastName;
    form.status = props.user.status;
  } else {
    form.email = "";
    form.name = "";
    form.lastName = "";
    form.status = "ACTIVE";
    form.password = "";
  }
});

const createUser = async () => {
  if (!form.email || !form.name || !form.lastName || !form.password) {
    showToast("Please fill in all required fields", "error");
    return;
  }

  try {
    isLoading.value = true;
    const requestInfo: RequestInformation = {
      path: `users/register-user`,
      method: "POST",
      data: {
        email: form.email,
        name: form.name,
        lastName: form.lastName,
        status: form.status,
        password: form.password,
      },
    };

    const response = await sendBackEndRequest(requestInfo);

    if (response.success) {
      showToast(response.message || "User created successfully", "success");
      emit("userSaved");
    } else {
      showToast(
        response.data?.error?.message || "Failed to create user",
        "error"
      );
    }
  } catch (error) {
    showToast("Error creating user", "error");
  } finally {
    isLoading.value = false;
  }
};

const updateUser = async () => {
  if (!form.name || !form.lastName) {
    showToast("Please fill in all required fields", "error");
    return;
  }

  try {
    isLoading.value = true;
    const requestInfo: RequestInformation = {
      path: "users/update-user", 
      method: "PUT",
      data: {
        email: form.email, 
        name: form.name,
        lastName: form.lastName,
      },
    };

    const response = await sendBackEndRequest(requestInfo);

    if (response.success) {
      showToast(response.message || "User updated successfully", "success");
      emit("userSaved");
    } else {
      showToast(
        response.data?.error?.message || "Failed to update user",
        "error"
      );
    }
  } catch (error) {
    showToast("Error updating user", "error");
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => {
  if (props.isNew) {
    createUser();
  } else {
    updateUser();
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
          {{ isNew ? "Create New User" : "Edit User" }}
        </v-card-title>

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.name"
            label="User Name"
            :disabled="isLoading"
            required
          ></v-text-field>

          <v-text-field
            v-model="form.lastName"
            label="User Last Name"
            :disabled="isLoading"
            required
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            label="User Email"
            type="email"
            :disabled="!isNew || isLoading"
            required
          ></v-text-field>

          <v-text-field
            v-if="isNew"
            v-model="form.password"
            label="User Password"
            type="password"
            :disabled="isLoading"
            required
          ></v-text-field>

          <v-select
            v-if="isNew"
            v-model="form.status"
            label="Status"
            :items="[
              { title: 'Active', value: 'ACTIVE' },
              { title: 'Not Active', value: 'NOT_ACTIVE' },
            ]"
            :disabled="isLoading"
            required
          ></v-select>

          <div class="d-flex justify-end gap-2 mt-4">
            <v-btn
              variant="outlined"
              @click="$emit('close')"
              :disabled="isLoading"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ isNew ? "Create User" : "Update User" }}
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
