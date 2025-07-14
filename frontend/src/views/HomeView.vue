<script setup lang="ts">
import Card from "@/components/Card.vue";
import { computed, ref } from 'vue';
import PaginationComponent from "@/components/PaginationComponent.vue";

const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 4;

const allCards = ref([
  {
    title: "Welcome to the Home Page",
    subtitle: "This is a simple Vue 3 application",
    text: "You can use this page to display information or navigate to other parts of the application."
  },
  {
    title: "Getting Started",
    subtitle: "Learn the basics",
    text: "Explore our documentation to learn how to use this application effectively."
  },
  {
    title: "Features",
    subtitle: "What we offer",
    text: "Discover all the amazing features available in this application."
  },
  {
    title: "Recent Updates",
    subtitle: "What's new",
    text: "Stay up to date with our latest improvements and additions."
  },
  {
    title: "Support",
    subtitle: "Need help?",
    text: "Contact our support team if you have any questions or issues."
  },
  {
    title: "Tutorials",
    subtitle: "Step-by-step guides",
    text: "Learn how to make the most of our platform with these detailed tutorials."
  },
  {
    title: "Resources",
    subtitle: "Helpful tools",
    text: "Access our collection of resources to enhance your productivity."
  },
  {
    title: "Community",
    subtitle: "Join our network",
    text: "Connect with other users and share your experiences and tips."
  },
  {
    title: "Feedback",
    subtitle: "Help us improve",
    text: "Share your thoughts and suggestions to help us make our service better."
  }
]);

const totalPages = computed(() => Math.ceil(allCards.value.length / itemsPerPage));

const cards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allCards.value.slice(start, end);
});

const changePage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleCardClick = (index: number) => {
  console.log(`Card ${index} clicked`);
};
</script>

<template>
  <div class="home-container">
    <h1 class="page-title">Dashboard</h1>

    <PaginationComponent
        :totalItems="allCards.length"
        :currentPage="currentPage"
        @update:current-page="changePage"
    />

    <div class="cards-grid">
      <div v-for="(card, index) in cards" :key="index" class="card-wrapper">
        <Card
            :title="card.title"
            :subtitle="card.subtitle"
            :text="card.text"
            :loading="isLoading"
            @cardClick=handleCardClick(index)
        >
          <template v-slot:actions>
            <v-btn variant="text" color="primary">Learn More</v-btn>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
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
  gap: 20px;
}

.card-wrapper {
  height: 100%;
  min-height: 200px;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .pagination-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    font-size: 0.9rem;
  }
}
</style>
