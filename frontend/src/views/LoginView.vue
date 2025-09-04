<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card
          class="pa-6"
          elevation="10"
          :style="{ borderRadius: 'var(--card-radius)' }"
          v-if="!isLoggedIn"
        >
          <v-card-title
            class="justify-center"
            style="color: var(--color-heading); font-weight: 700"
          >
            Login
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submit" ref="formRef">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                autocomplete="username"
                variant="outlined"
                color="primary"
                class="mb-3"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[rules.required]"
                autocomplete="current-password"
                variant="outlined"
                color="primary"
                class="mb-3"
                required
              />
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-3"
                border="start"
                density="compact"
              >
                {{ error }}
              </v-alert>
              <v-btn
                :loading="loading"
                :disabled="loading"
                type="submit"
                color="primary"
                block
                size="large"
                elevation="2"
                style="font-weight: 600"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card
          class="pa-6"
          elevation="10"
          :style="{ borderRadius: 'var(--card-radius)' }"
          v-else
        >
          <v-card-title
            class="justify-center"
            style="color: var(--color-heading); font-weight: 700"
          >
            Welcome Back!
          </v-card-title>
          <v-card-text>
            <p>You are already logged in.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { sendBackEndRequest } from "@/api/Requests";
import Router from "@/router";
import { useUserState } from "@/stores/UserState";
import { showToast } from "@/utils/Toast";
import { ref } from "vue";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const formRef = ref();
const { setUser, isLoggedIn } = useUserState();

const rules = {
  required: (v: string) => !!v || "This field is required",
  email: (v: string) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "E-mail must be valid",
};

const submit = async () => {
  error.value = "";
  if (formRef.value && !(await formRef.value.validate())) return;
  loading.value = true;
  try {
    const response = await sendBackEndRequest({
      path: "users/login",
      method: "POST",
      data: {
        email: email.value,
        password: password.value,
      },
    });
    if (response.success && response.data) {
      setUser(response.data.user);
      showToast("Logged in successfully", "success");
    } else {
      error.value = response.data.error.message || "Login failed";
    }
  } catch (e) {
    error.value = "Network error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: var(--card-shadow);
  color: white;
}
.v-text-field input {
  background: var(--color-background-mute) !important;
  color: var(--color-text) !important;
}
.v-label {
  color: var(--color-text) !important;
}
.v-btn {
  color: var(--neutral-100) !important;
}
</style>
