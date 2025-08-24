<script setup lang="ts">
import Card from "@/components/Card.vue";
import { onMounted, ref } from 'vue';
import PaginationComponent from "@/components/PaginationComponent.vue";
import { type RequestInformation, sendBackEndRequest } from "@/api/Requests.ts";
import Router from "@/router";
import type { EventCard } from "@/types/Events.ts";

const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const allCards = ref<EventCard[]>([]);

const getCards = async () => {
  const requestInfo: RequestInformation = {
    method: 'GET',
    path: `events?page=${currentPage.value}`,
  };
  const { success, data } = await sendBackEndRequest(requestInfo);

  if (success) {
    allCards.value = data.events;
    totalPages.value = data.pagination.totalPages;
  }
};

onMounted(getCards);

const changePage = async (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    await getCards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};


const handleCardClick = (id: number) => {
  Router.push({ path: `events/${id}` });
};

</script>

<template>
  <div class="home-container">
    <h1 class="page-title">All Events</h1>

    <PaginationComponent
        :total-pages="totalPages"
        :currentPage="currentPage"
        @update:current-page="changePage"
    />
    <div class="fade-container">
      <div class="cards-grid">
        <div v-for="(card, index) in allCards" :key="card.id" class="card-wrapper">
          <Card
              :id="card.id"
              :title="card.title"
              :description="card.description"
              :location="card.location"
              :eventDate="card.eventDate"
              :tags="card.tags"
              :loading="isLoading"
              :views="card.views"
              :authorEmail="card.authorEmail"
              :categoryName="card.categoryName"
              :maxCapacity="card.maxCapacity"
              :likeCount="card.likeCount"
              :dislikeCount="card.dislikeCount"
              :createdAt="card.createdAt"
              @cardClick="handleCardClick(card.id)"
          >
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<!--suppress CssInvalidPropertyValue -->
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
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.cards-grid::-webkit-scrollbar {
  width: 16px; /* Increased width for better visibility */
}

.card-wrapper {
  height: 100%;
  min-height: 300px;
}

.cards-grid::-webkit-scrollbar {
  width: 16px; /* Increased width for better visibility */
}

.cards-grid::-webkit-scrollbar-track {
  background: var(--neutral-800, #1f2937); /* Darker track */
  border-radius: 10px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background-color: var(--primary-color); /* Darker thumb color */
  border-radius: 10px;
  border: 3px solid var(--neutral-800, #1f2937); /* Border creates padding effect */
  min-height: 50px; /* Ensure minimum thumb size */
  transition: background-color 0.3s;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background-color: var(--primary-dark); /* Even darker on hover */
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
