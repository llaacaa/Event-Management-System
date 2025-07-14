<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(['update:currentPage']);
const { totalItems, currentPage } = toRefs(props);

const totalPages = computed(() => Math.ceil(totalItems.value / 4));

const changePage = (page: number) => {
  if (page > 0 && page <= totalPages.value && page !== currentPage.value) {
    emit('update:currentPage', page);
  }
};

const paginationNumbers = computed(() => {
  const pages: (number | string)[] = [];
  const maxPagesToShow = 5;

  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages.value - 1) {
      pages.push('...');
    }

    pages.push(totalPages.value);
  }

  return pages;
});
</script>

<template>
  <div class="pagination-container">
    <button
        class="pagination-btn pagination-arrow"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
    >
      &laquo;
    </button>

    <button
        v-for="page in paginationNumbers"
        :key="page"
        @click="typeof page === 'number' ? changePage(page) : null"
        :class="[
        'pagination-btn',
        typeof page === 'number'
          ? page === currentPage ? 'pagination-active' : ''
          : 'pagination-ellipsis'
      ]"
        :disabled="typeof page !== 'number'"
    >
      {{ page }}
    </button>

    <button
        class="pagination-btn pagination-arrow"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
    >
      &raquo;
    </button>
  </div>
</template>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  gap: 8px;
}

.pagination-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  background-color: var(--neutral-200);
  color: var(--neutral-700);
  border: 1px solid var(--neutral-400);
  border-radius: var(--card-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--neutral-300);
  color: var(--primary-color);
}

.pagination-active {
  background-color: var(--primary-color);
  color: var(--neutral-100);
  border-color: var(--primary-dark);
}

.pagination-active:hover {
  background-color: var(--primary-dark) !important;
  color: var(--neutral-100) !important;
}

.pagination-ellipsis {
  background: transparent;
  border: none;
  color: var(--neutral-600);
  cursor: default;
}

.pagination-arrow {
  font-weight: bold;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
