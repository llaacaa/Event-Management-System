<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import type { EventCard } from "@/types/Events";
import { onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { handleCardClick } from "@/utils/ChangeRoute";

const events = ref<EventCard[]>([]);

const fetchMostInteractedEvents = async () => {
  const requestInfo: RequestInformation = {
    method: "GET",
    path: "events/most-interacted",
  };

  const { success, data } = await sendBackEndRequest(requestInfo);

  if (success) {
    events.value = data.events;
  }
};

onMounted(() => {
  fetchMostInteractedEvents();
});
</script>

<template>
  <div class="most-interacted">
    <div class="most-interacted-header">
      <h2>Most Interacted Events</h2>
      <FontAwesomeIcon :icon="fas.faFire" class="trending-icon" />
    </div>
    <ul class="event-list">
      <li v-for="event in events" :key="event.id" class="event-item" @click="handleCardClick(event.id)">
        <h3 class="event-title">{{ event.title }}</h3>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.most-interacted {
  position: absolute;
  top: 10%; 
  right: 2%;
  width: 250px;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 90;
}

.most-interacted-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.most-interacted-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

.trending-icon {
  color: #ff6b6b;
}

.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.event-item {
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.event-item:hover {
  background-color: var(--color-background-mute);
}

.event-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  margin-bottom: 0.25rem;
}

.event-interactions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.interaction-count {
  font-size: 0.8rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon {
  font-size: 0.8rem;
}

@media (max-width: 1024px) {
  .most-interacted {
    position: static;
    width: 100%;
    max-width: 600px;
    margin: 1rem auto;
  }
}
</style>
