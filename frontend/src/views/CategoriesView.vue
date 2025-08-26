<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { formatDate } from "@/utils/DateFromatter";
import { handleCategoryClick } from "@/utils/ChangeRoute";

interface Category {
  name: string;
  description: string;
  createdAt: string;
}

const categories = ref<Category[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

async function fetchCategories(page = 1) {
  isLoading.value = true;
  const requestInfo: RequestInformation = {
    method: "GET",
    path: `categories?page=${page}`,
  };
  try {
    const response = await sendBackEndRequest(requestInfo);
    categories.value = response.data;
    totalPages.value = response.pagination?.totalPages || 1;
  } catch (error) {
    categories.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => fetchCategories(currentPage.value));

watch(currentPage, (page) => {
  fetchCategories(page);
});
</script>

<template>
  <div class="categories-view">
    <h1 class="text-2xl font-bold mb-6">Categories</h1>

    <PaginationComponent
      v-if="totalPages > 1"
      :totalPages="totalPages"
      v-model:currentPage="currentPage"
      class="mb-6"
    />

    <div v-if="isLoading" class="loading">
      <div class="loader"></div>
      <span>Loading categories...</span>
    </div>

    <div v-else class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.name"
        class="category-pill"
        @click="handleCategoryClick(category.name)"
      >
        <div class="category-content">
          <div class="category-main">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description.length > 40 ? category.description.slice(0, 40) + '...' : category.description }}</p>
          </div>
          <div class="category-meta">
            <span class="category-date">{{
              formatDate(category.createdAt)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-pill {
  background: var(--color-background-soft);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.category-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -4px rgba(0, 0, 0, 0.15);
  border-color: var(--color-border-hover);
}

.category-content {
  padding: 1.25rem;
}

.category-main {
  margin-bottom: 1rem;
}

.category-name {
  color: var(--color-heading);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.category-description {
  color: var(--color-text);
  font-size: 0.925rem;
  margin-bottom: 1rem;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.category-date {
  color: var(--neutral-600);
  font-size: 0.875rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.action-button.edit {
  background-color: var(--primary-color);
  color: white;
}

.action-button.edit:hover {
  background-color: var(--primary-dark);
}

.action-button.delete {
  background-color: var(--neutral-200);
  color: var(--neutral-700);
}

.action-button.delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--color-text);
  gap: 1rem;
}

.loader {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--neutral-300);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dark mode specific styles */
@media (prefers-color-scheme: dark) {
  .action-button.delete {
    background-color: var(--neutral-800);
    color: var(--neutral-400);
  }

  .action-button.delete:hover {
    background-color: #991b1b;
    color: var(--neutral-200);
  }
}
</style>
