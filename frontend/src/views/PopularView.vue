<script setup lang="ts">
import EventCardsGrid from "@/components/EventCardsGrid.vue";
</script>

<template>
  <EventCardsGrid
    title="10 Popular Events"
    apiPath="events/popular"
  />
</template>