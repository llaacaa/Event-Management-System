=
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useEventStore } from "@/stores/EventDetailState.ts";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { type RequestInformation, sendBackEndRequest } from "@/api/Requests.ts";
import CommentSection from "@/components/CommentSection.vue";
import { formatDate, formatTime } from "@/utils/DateFromatter.ts";

const eventStore = useEventStore();
const route = useRoute();
const eventId = computed(() => Number(route.params.id));
const eventData = computed(() => eventStore.selectedEvent);
const isLoading = ref(false);
const isLiked = ref(false);
const likeCount = ref(0);
const isDisliked = ref(false);
const dislikeCount = ref(0);
const viewCount = ref(0);

const areCommentsEnabled = ref(false);

const loadEventData = async () => {
  isLoading.value = true;
  try {
    const requestInfo: RequestInformation = {
      method: "GET",
      path: `events/${eventId.value}`,
    };
    const { success: isFetchingEventSuccessful, data: eventData } =
      await sendBackEndRequest(requestInfo);

    if (isFetchingEventSuccessful && eventData) {
      eventStore.setSelectedEvent(eventData);
      viewCount.value = eventData.views;
    }

    const reactionsOnEventRequestInfo: RequestInformation = {
      method: "GET",
      path: `events/${eventId.value}/reactions`,
    };

    const viewCountRequestInfo: RequestInformation = {
      method: "PUT",
      path: `events/increment-views/${eventId.value}`,
    };

    const viewCountResponse = await sendBackEndRequest(viewCountRequestInfo);

    if (viewCountResponse.success) {
      viewCount.value += 1;
    }

    const reactionsInfo = await sendBackEndRequest(reactionsOnEventRequestInfo);

    if (reactionsInfo.success) {
      switch (reactionsInfo?.data[0]?.reactionType) {
        case "like":
          isLiked.value = true;
          break;
        case "dislike":
          isDisliked.value = true;
          break;
        default:
          isLiked.value = false;
          isDisliked.value = false;
          break;
      }
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
  } finally {
    isLoading.value = false;
    likeCount.value = eventData.value?.likeCount || 0;
    dislikeCount.value = eventData.value?.dislikeCount || 0;
  }
};

loadEventData();

onBeforeRouteUpdate((to, from, next) => {
  loadEventData();
  next();
});

const handleLike = async () => {
  if (isDisliked.value) {
    isDisliked.value = false;
    dislikeCount.value = dislikeCount.value - 1;
  }

  const requestInfo: RequestInformation = isLiked.value
    ? {
        method: "DELETE",
        path: `events/remove-reaction/${eventId.value}`,
      }
    : {
        method: "PUT",
        path: `events/like/${eventId.value}`,
      };

  const response = await sendBackEndRequest(requestInfo);
  if (response.success) {
    likeCount.value = !isLiked.value
      ? likeCount.value + 1
      : likeCount.value - 1;
  }

  isLiked.value = !isLiked.value;
};

const handleDislike = async () => {
  if (isLiked.value) {
    isLiked.value = false;
    likeCount.value = likeCount.value - 1;
  }

  const requestInfo: RequestInformation = isDisliked.value
    ? {
        method: "DELETE",
        path: `events/remove-reaction/${eventId.value}`,
      }
    : {
        method: "PUT",
        path: `events/dislike/${eventId.value}`,
      };

  const response = await sendBackEndRequest(requestInfo);
  if (response.success) {
    dislikeCount.value = !isDisliked.value
      ? dislikeCount.value + 1
      : dislikeCount.value - 1;
  }

  isDisliked.value = !isDisliked.value;
};
</script>

<template>
  <div class="event-details-container">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>

    <div v-else-if="eventData" class="event-card relative">
      <header class="event-header">
        <h1>{{ eventData.title }}</h1>
        <div class="event-meta">
          <span class="meta-pill">
            <v-icon icon="mdi-widgets" size="18" color="white" class="mr-1" />
            <span>{{ eventData.categoryName }}</span>
          </span>
          <span class="meta-pill">
            <v-icon icon="mdi-account" size="18" color="white" class="mr-1" />
            <span>{{ eventData.authorEmail }}</span>
          </span>
        </div>
        <div class="event-meta-secondary">
          <span class="meta-pill secondary">
            <v-icon icon="mdi-eye" size="18" color="#cbd5e1" class="mr-1" />
            <span>{{ viewCount }}</span>
          </span>
          <span class="meta-pill secondary">
            <v-icon
              icon="mdi-calendar"
              size="18"
              color="#cbd5e1"
              class="mr-1"
            />
            <b class="text-blue-200">Created:</b>
            <span class="ml-1">{{ formatDate(eventData.createdAt) }}</span>
          </span>
        </div>
      </header>

      <div class="event-content">
        <div class="info-section">
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">{{ formatDate(eventData.eventDate) }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Time</div>
            <div class="info-value">{{ formatTime(eventData.eventDate) }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">Location</div>
            <div class="info-value">{{ eventData.location }}</div>
          </div>
        </div>

        <div class="description-section">
          <h2>Description</h2>
          <p>{{ eventData.description }}</p>
        </div>

        <div
          v-if="eventData.tags && eventData.tags.length"
          class="tags-section"
        >
          <span v-for="tag in eventData.tags" :key="tag" class="tag">
            <v-icon icon="mdi-tag" size="18" color="black" class="mr-1" />
            {{ tag }}</span
          >
        </div>
      </div>

      <div class="actions-section">
        <button
          class="action-button"
          :class="{ liked: isLiked }"
          @click="handleLike"
        >
          <v-icon v-if="isLiked" icon="mdi-thumb-up" color="blue"></v-icon>
          <v-icon v-else icon="mdi-thumb-up" color="white"></v-icon>
          <span :class="{ 'text-blue': isLiked }">{{ likeCount }}</span>
        </button>
        <button
          class="action-button"
          :class="{ disliked: isDisliked }"
          @click="handleDislike"
        >
          <v-icon v-if="isDisliked" icon="mdi-thumb-down" color="red"></v-icon>
          <v-icon v-else icon="mdi-thumb-down" color="white"></v-icon>
          <span :class="{ 'text-red': isDisliked }">{{ dislikeCount }}</span>
        </button>
        <button
          class="action-button"
          :class="{ 'bg-white': areCommentsEnabled }"
          @click="areCommentsEnabled = !areCommentsEnabled"
        >
          <v-icon icon="mdi-comment"></v-icon>
        </button>
      </div>

      <div class="comments-container" v-if="areCommentsEnabled">
        <CommentSection :eventId="eventId" />
      </div>
    </div>
    <div v-else class="not-found">
      <h2>Event not found</h2>
      <p>We couldn't find the event you're looking for.</p>
    </div>
  </div>
</template>

<style scoped>
.event-details-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--color-text);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 5px solid var(--color-background-mute);
  border-bottom-color: var(--primary-color);
  border-radius: 50%;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.event-card {
  background-color: var(--color-background-soft);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.event-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  position: relative;
}

.event-header h1 {
  color: white;
  margin-bottom: 0.25rem;
  font-size: 2rem;
}

.event-meta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.event-meta-secondary {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 0.5rem;
}

.meta-pill {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.9rem 0.25rem 0.6rem;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
  transition: background 0.2s;
}

.meta-pill:hover {
  background: rgba(255, 255, 255, 0.25);
}

.meta-pill.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #e0e7ef;
  font-size: 0.95rem;
  font-weight: 400;
}

.meta-pill.secondary b {
  color: #93c5fd;
  font-weight: 600;
}

.event-content {
  padding: 1.5rem;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: var(--color-background-mute);
  border-radius: var(--card-radius);
  padding: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 500;
}

.description-section {
  margin-bottom: 2rem;
}

.description-section h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.image-section {
  margin-bottom: 2rem;
}

.image-section img {
  width: 100%;
  border-radius: var(--card-radius);
  max-height: 400px;
  object-fit: cover;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  background-color: var(--secondary-light);
  color: var(--neutral-900);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.actions-section {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-background-mute);
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--neutral-400);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: rgba(57, 43, 78, 0.7);
}

.action-button.liked {
  background-color: white;
  color: var(--neutral-100);
  border-color: blue;
}

.action-button.disliked {
  background-color: black;
  color: var(--neutral-100);
  border-color: #f87171;
}

.action-icon {
  font-size: 1.2rem;
}

.comments-container {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.not-found {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

@media (max-width: 600px) {
  .info-section {
    grid-template-columns: 1fr;
  }

  .actions-section {
    flex-direction: column;
  }
}
</style>
