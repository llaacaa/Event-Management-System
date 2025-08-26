<script setup lang="ts">
import Card from "@/components/Card.vue";
import { onMounted, ref } from "vue";
import { type RequestInformation, sendBackEndRequest } from "@/api/Requests.ts";
import type { EventCard } from "@/types/Events.ts";
import { handleCardClick } from "@/utils/ChangeRoute";

const props = defineProps<{
  title: string;
  apiPath: string;
}>();

const isLoading = ref(false);
const allCards = ref<EventCard[]>([]);

const getCards = async () => {
  isLoading.value = true;
  const requestInfo: RequestInformation = {
    method: "GET",
    path: props.apiPath,
  };
  const { success, data } = await sendBackEndRequest(requestInfo);
  if (success) {
    allCards.value = data.events;
  }
  isLoading.value = false;
};

onMounted(getCards);
</script>

<template>
  <div class="home-container">
    <h1 class="page-title">{{ title }}</h1>
    <div class="fade-container">
      <div class="cards-grid">
        <div
          v-for="card in allCards"
          :key="card.id"
          class="card-wrapper"
        >
          <Card
            v-bind="card"
            :loading="isLoading"
            @cardClick="handleCardClick(card.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}
.page-title {
  font-size: 2rem;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 35px;
  max-height: 73vh;
  overflow-y: scroll;
  padding-right: 32px;
  padding-left: 3rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.fade-container {
  position: relative;
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 20%,
    black 80%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    black 20%,
    black 80%,
    transparent
  );
}
.cards-grid::-webkit-scrollbar {
  width: 16px;
}
.card-wrapper {
  height: 100%;
  min-height: 300px;
}
.cards-grid::-webkit-scrollbar-track {
  background: var(--neutral-800, #1f2937);
  border-radius: 10px;
}
.cards-grid::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 10px;
  border: 3px solid var(--neutral-800, #1f2937);
  min-height: 50px;
  transition: background-color 0.3s;
}
.cards-grid::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-dark);
}
@media (max-width: 768px) {
  .card-wrapper {
    min-height: 150px;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 1.75rem;
  }
}
</style>