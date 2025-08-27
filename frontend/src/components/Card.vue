<template>
  <v-card
    :loading="loading"
    :rounded="`lg`"
    class="card-custom px-6 py-8"
    elevation="3"
    @click="onClick"
  >
    <v-card-item>
      <div class="card-header">
        <div v-if="tags && tags.length" class="tags-container">
          <v-chip
            v-for="tag in tags"
            :key="tag.id"
            size="default"
            color="primary"
            variant="outlined"
          >
            {{ tag.name }}
          </v-chip>
        </div>
        <h3 class="card-title text-h3">{{ titleToUse }}</h3>
        <div v-if="authorEmail" class="author-info">
          <v-icon size="small" icon="mdi-account"></v-icon>
          <span>{{ authorEmail }}</span>
        </div>
        <div class="card-metadata">
          <div v-if="location" class="metadata-item">
            <v-icon size="small" icon="mdi-map-marker"></v-icon>
            <span class="location">{{ location }}</span>
          </div>
          <div v-if="eventDate" class="metadata-item">
            <v-icon size="small" icon="mdi-calendar"></v-icon>
            <span class="event-date">{{ formatDate(eventDate) }}</span>
          </div>
          <div v-if="categoryName" class="metadata-item">
            <v-icon size="small" icon="mdi-tag"></v-icon>
            <span class="category">{{ categoryName }}</span>
          </div>
        </div>
      </div>
    </v-card-item>

    <v-card-text class="card-content">
      <p class="description-text">{{ descriptionToUse }}</p>

      <div class="card-stats">
        <div class="stat-item">
          <v-icon icon="mdi-eye" color="gray"></v-icon>
          <span class="bg-gray-100 rounded-xl px-2 text-black">{{
            views
          }}</span>
        </div>
        <div class="stat-item">
          <v-icon icon="mdi-thumb-up" color="blue"></v-icon>
          <span class="bg-blue-100 rounded-xl px-2 text-black">{{
            likeCount
          }}</span>
        </div>
        <div class="stat-item">
          <v-icon icon="mdi-thumb-down" color="red"></v-icon>
          <span class="bg-red-100 rounded-xl px-2 text-black">{{
            dislikeCount
          }}</span>
        </div>
        <div v-if="maxCapacity" class="stat-item">
          <v-icon size="large" icon="mdi-account-group"></v-icon>
          <span class="bg-gray-100 rounded-xl px-2">{{ maxCapacity }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Tag } from "@/types/Events";
import { formatDate } from "@/utils/DateFromatter.ts";
import { computed, toRef } from "vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: String,
    default: "",
  },
  eventDate: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  views: {
    type: Number,
    default: 0,
  },
  authorEmail: {
    type: String,
    default: "",
  },
  categoryName: {
    type: String,
    default: "",
  },
  maxCapacity: {
    type: Number,
    default: null,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
  tags: {
    type: Array as () => Tag[],
    default: () => [],
  },
});

const emit = defineEmits(["cardClick"]);

const descriptionToUse = computed(() => {
  const desc = props.description;
  return desc.length > 20 ? desc.slice(0, 20) + "..." : desc;
});

const titleToUse = computed(() => {
  const title = props.title;
  return title.length > 15 ? title.slice(0, 15) + "..." : title;
});

const onClick = () => {
  emit("cardClick");
};
</script>

<style scoped>
.card-custom {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

.card-custom:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--dark-heeader-card);
}

.card-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.metadata-item {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: var(--primary-dark);
  gap: 4px;
}

.card-content {
  flex: 1;
  padding: 8px 16px 16px;
  position: relative;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-stats {
  position: absolute;
  bottom: 0;
  right: 2rem;
  display: flex;
  gap: 16px;
  margin: 16px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: var(--neutral-600);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--neutral-600);
}

.tags-container {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  right: 2rem;
  top: 0;
  flex-direction: column;
}
</style>
