<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import UserForm from "@/components/UserForm.vue";
import type { User } from "@/types/User";
import { showToast } from "@/utils/Toast";
import { ref } from "vue";

const users = ref<User[]>([]);
const showForm = ref(false);
const selectedUser = ref<User | null>(null);
const isNewUser = ref(true);
const loading = ref(false);

const getUsers = async () => {
  loading.value = true;
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
  } finally {
    loading.value = false;
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

const openCreateUserForm = () => {
  selectedUser.value = null;
  isNewUser.value = true;
  showForm.value = true;
};

const openEditUserForm = (user: User) => {
  selectedUser.value = { ...user };
  isNewUser.value = false;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  selectedUser.value = null;
};

const onUserSaved = () => {
  closeForm();
  getUsers();
};

const getUserTypeColor = (userType: string) => {
  return userType == "ADMIN" ? "purple" : "blue";
};

const getStatusColor = (status: string) => {
  return status === "ACTIVE" ? "success" : "warning";
};

getUsers();
</script>

<template>
  <v-container fluid class="pa-6">
    <div class=" align-center mb-6">
      <div>
        <h1 class="text-h3 font-weight-bold text-primary mb-2">
          User Management
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Manage system users and their permissions
        </p>
      </div>
      <v-btn
        @click="openCreateUserForm"
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        elevation="2"
        class="px-6 mx-5"
      >
        Add New User
      </v-btn>
    </div>

    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  Total Users
                </p>
                <p class="text-h4 font-weight-bold text-primary">
                  {{ users.length }}
                </p>
              </div>
              <v-icon color="primary" size="40">mdi-account-group</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  Active Users
                </p>
                <p class="text-h4 font-weight-bold text-success">
                  {{ users.filter((u) => u.status === "ACTIVE").length }}
                </p>
              </div>
              <v-icon color="success" size="40">mdi-account-check</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  Inactive Users
                </p>
                <p class="text-h4 font-weight-bold text-warning">
                  {{ users.filter((u) => u.status === "NOT_ACTIVE").length }}
                </p>
              </div>
              <v-icon color="warning" size="40">mdi-account-off</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card elevation="2" class="user-table-card">
      <v-card-title class="pa-6 pb-0">
        <div class="d-flex align-center justify-space-between w-100">
          <h2 class="text-h5 font-weight-bold">All Users</h2>
          <v-btn
            @click="getUsers"
            variant="outlined"
            size="small"
            prepend-icon="mdi-refresh"
            :loading="loading"
          >
            Refresh
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-data-table-virtual
          :headers="[
            { title: 'Name', key: 'name', sortable: true },
            { title: 'Email', key: 'email', sortable: true },
            { title: 'User Type', key: 'userType', sortable: true },
            { title: 'Status', key: 'status', sortable: true },
            {
              title: 'Actions',
              key: 'actions',
              sortable: false,
              width: '200px',
            },
          ]"
          :items="users"
          :loading="loading"
          item-key="email"
          class="user-table"
          height="400"
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar
                :color="getUserTypeColor(item.userType)"
                size="40"
                class="mr-3"
              >
                <span class="text-white font-weight-bold">
                  {{ item.name.charAt(0) }}{{ item.lastName.charAt(0) }}
                </span>
              </v-avatar>
              <div>
                <p class="font-weight-medium mb-0">
                  {{ item.name }} {{ item.lastName }}
                </p>
              </div>
            </div>
          </template>

          <template v-slot:item.email="{ item }">
            <div class="d-flex align-center">
              <v-icon size="16" class="mr-2 text-medium-emphasis"
                >mdi-email</v-icon
              >
              <span>{{ item.email }}</span>
            </div>
          </template>

          <template v-slot:item.userType="{ item }">
            <v-chip
              :color="getUserTypeColor(item.userType)"
              variant="tonal"
              size="small"
              class="font-weight-medium"
            >
              {{ item.userType }}
            </v-chip>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              variant="tonal"
              size="small"
              :prepend-icon="
                item.status === 'ACTIVE'
                  ? 'mdi-check-circle'
                  : 'mdi-pause-circle'
              "
              class="font-weight-medium"
            >
              {{ item.status === "ACTIVE" ? "Active" : "Inactive" }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                @click="openEditUserForm(item)"
                color="primary"
                variant="outlined"
                size="small"
                icon="mdi-pencil"
                density="comfortable"
              />

              <v-btn
                v-if="item.status === 'NOT_ACTIVE'"
                @click="setStatus(item.email, 'ACTIVE')"
                color="success"
                variant="outlined"
                size="small"
                icon="mdi-play"
                density="comfortable"
              />

              <v-btn
                v-if="item.status === 'ACTIVE'"
                @click="setStatus(item.email, 'NOT_ACTIVE')"
                color="warning"
                variant="outlined"
                size="small"
                icon="mdi-pause"
                density="comfortable"
              />
            </div>
          </template>

          <template v-slot:no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">
                mdi-account-off-outline
              </v-icon>
              <p class="text-h6 text-medium-emphasis mb-2">No users found</p>
              <p class="text-body-2 text-medium-emphasis">
                Get started by adding your first user
              </p>
              <v-btn
                @click="openCreateUserForm"
                color="primary"
                variant="elevated"
                class="mt-4"
                prepend-icon="mdi-plus"
              >
                Add First User
              </v-btn>
            </div>
          </template>

          <template v-slot:loading>
            <div class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="64" />
              <p class="text-body-1 text-medium-emphasis mt-4">
                Loading users...
              </p>
            </div>
          </template>
        </v-data-table-virtual>
      </v-card-text>
    </v-card>

    <UserForm
      v-if="showForm"
      :user="selectedUser"
      :is-new="isNewUser"
      @close="closeForm"
      @user-saved="onUserSaved"
    />
  </v-container>
</template>

<style scoped>
.stats-card {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface), 0.9) 0%,
    rgba(var(--v-theme-surface), 1) 100%
  );
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-shadow), 0.15) !important;
}

.user-table-card {
  background: rgba(var(--v-theme-surface), 1);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.user-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.user-table :deep(.v-data-table-header) {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
}

.user-table :deep(.v-data-table-header th) {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.87);
  border-bottom: 2px solid rgba(var(--v-theme-outline), 0.12);
}

.user-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}

.user-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.08);
  padding: 12px 16px;
}

/* Custom scrollbar for the virtual table */
.user-table :deep(.v-data-table-virtual__wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-outline), 0.3) transparent;
}

.user-table :deep(.v-data-table-virtual__wrapper::-webkit-scrollbar) {
  width: 6px;
}

.user-table :deep(.v-data-table-virtual__wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

.user-table :deep(.v-data-table-virtual__wrapper::-webkit-scrollbar-thumb) {
  background-color: rgba(var(--v-theme-outline), 0.3);
  border-radius: 3px;
}

.user-table
  :deep(.v-data-table-virtual__wrapper::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(var(--v-theme-outline), 0.5);
}
</style>
