<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import type { EventCard } from "@/types/Events";
import { handleCardClick } from "@/utils/ChangeRoute";
import { formatDate } from "@/utils/DateFromatter";
import { ref, watch, nextTick } from "vue";

const searchInput = ref("");

const searchedEvents = ref<EventCard[]>([]);
const currentPage = ref(1);
const hasMorePages = ref(true);
const isLoading = ref(false);
const isLoadingMore = ref(false);

const isFocused = ref<boolean>(false);
const isMouseOver = ref<boolean>(false);

watch([isFocused, isMouseOver], (values) => {
  //   console.log("🚀 ~ val:", val)
  if (!values[0] && !values[1]) {
    searchInput.value = "";
    searchedEvents.value = [];
  }
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

async function fetchEvents(
  query: string,
  page: number = 1,
  append: boolean = false
) {
  const requestInfo: RequestInformation = {
    method: "GET",
    path: `events?search=${query}&page=${page}`,
  };

  const response = await sendBackEndRequest(requestInfo);
  const events = response.data.events as EventCard[];
  const pagination = response.data.pagination;

  if (append) {
    searchedEvents.value = [...searchedEvents.value, ...events];
  } else {
    searchedEvents.value = events;
  }

  hasMorePages.value = pagination.page < pagination.totalPages;

  return events;
}

function onSearchChange(val: string) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    isLoading.value = true;
    currentPage.value = 1;
    hasMorePages.value = true;

    try {
      await fetchEvents(val, 1);
    } catch (error) {
      console.error("Search error:", error);
      searchedEvents.value = [];
    } finally {
      isLoading.value = false;
    }
  }, 1000);
}

async function loadMoreEvents() {
  if (!hasMorePages.value || isLoadingMore.value || !searchInput.value.trim()) {
    return;
  }

  isLoadingMore.value = true;
  const nextPage = currentPage.value + 1;

  try {
    const events = await fetchEvents(searchInput.value.trim(), nextPage, true);
    // Update current page after successful fetch
    currentPage.value = nextPage;
  } catch (error) {
    console.error("Load more error:", error);
  } finally {
    isLoadingMore.value = false;
  }
}

function onScroll(event: Event) {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 50) {
    loadMoreEvents();
  }
}

watch(searchInput, (val) => {
  if (val.trim().length == 0) {
    searchedEvents.value = [];
    currentPage.value = 1;
    hasMorePages.value = true;
  } else {
    onSearchChange(val);
  }
});
</script>

<template>
  <div class="search-wrapper">
    <v-text-field
      v-model="searchInput"
      density="compact"
      placeholder="Search events..."
      prepend-inner-icon="mdi-magnify"
      flat
      hide-details
      single-line
      variant="outlined"
      class="search-input"
      @focus="isFocused = true"
      @blur="isFocused = false"
      v-bind:focused="isFocused"
    ></v-text-field>

    <div
      v-if="searchInput.trim() && (searchedEvents.length || isLoading)"
      class="search-results"
      @mouseenter="isMouseOver = true"
      @mouseleave="isMouseOver = false"
    >
      <div class="results-header">
        <span class="results-count">
          <template v-if="isLoading">
            <v-icon size="14" class="loading-icon">mdi-loading</v-icon>
            Searching...
          </template>
          <template v-else>
            {{ searchedEvents.length }} result{{
              searchedEvents.length !== 1 ? "s" : ""
            }}
            <span v-if="hasMorePages" class="more-indicator">+</span>
          </template>
        </span>
      </div>

      <div class="results-list" @scroll="onScroll">
        <div
          v-for="(event, index) in searchedEvents"
          :key="event.id"
          class="result-item"
          :style="{ animationDelay: `${index * 50}ms` }"
          @mousedown.prevent="handleCardClick(event.id)"
        >
          <div class="event-icon">
            <v-icon size="20" color="primary">mdi-calendar-outline</v-icon>
          </div>
          <div class="event-content">
            <div class="event-title">{{ event.title }}</div>
            <div class="event-date">{{ formatDate(event.eventDate) }}</div>
          </div>
          <div class="event-arrow">
            <v-icon size="16" color="#999">mdi-chevron-right</v-icon>
          </div>
        </div>

        <div v-if="isLoadingMore" class="loading-more">
          <v-icon size="20" class="loading-icon">mdi-loading</v-icon>
          <span>Loading more events...</span>
        </div>

        <div
          v-else-if="!hasMorePages && searchedEvents.length > 0"
          class="end-of-results"
        >
          <v-icon size="16" color="#ccc">mdi-check-circle-outline</v-icon>
          <span>That's all the events!</span>
        </div>
      </div>
    </div>

    <div
      v-if="searchInput.trim() && !searchedEvents.length && !isLoading"
      class="search-results empty-state"
    >
      <div class="empty-content">
        <v-icon size="32" color="#ccc">mdi-calendar-search</v-icon>
        <p class="empty-text">No events found</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  width: 300px;
}

.search-input {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  width: 300px;
}

@media (max-width: 960px) {
  .search-wrapper {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
  
}

.search-input:focus-within {
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.15);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-top: 4px;
  max-height: 400px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.results-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(248, 250, 252, 0.8);
}

.results-count {
  font-size: 0.85em;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.more-indicator {
  color: #1976d2;
  font-weight: 600;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #666;
  font-size: 0.9em;
  font-weight: 500;
}

.end-of-results {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #999;
  font-size: 0.85em;
  font-weight: 500;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.results-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  animation: slideInFade 0.3s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes slideInFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-item:hover {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.08),
    rgba(25, 118, 210, 0.04)
  );
  transform: translateX(4px);
  box-shadow: inset 4px 0 0 rgba(25, 118, 210, 0.3);
}

.result-item:last-child {
  border-bottom: none;
}

.event-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 10px;
  margin-right: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.result-item:hover .event-icon {
  background: rgba(25, 118, 210, 0.15);
  transform: scale(1.05);
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95em;
  line-height: 1.3;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-date {
  color: #666;
  font-size: 0.85em;
  line-height: 1.2;
  font-weight: 400;
}

.event-arrow {
  opacity: 0;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.result-item:hover .event-arrow {
  opacity: 1;
  transform: translateX(2px);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.empty-content {
  text-align: center;
}

.empty-text {
  margin: 8px 0 0;
  color: #999;
  font-size: 0.9em;
  font-weight: 500;
}

/* Custom scrollbar */
.results-list::-webkit-scrollbar {
  width: 4px;
}

.results-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
}

.results-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .search-results {
    background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .results-header {
    background: rgba(45, 45, 45, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .result-item {
    border-color: rgba(255, 255, 255, 0.08);
  }

  .event-title {
    color: #f0f0f0;
  }

  .event-date {
    color: #bbb;
  }

}
</style>
