<script setup lang="ts">
import EventCardsGrid from "@/components/EventCardsGrid.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const path = ref("events/by-category/" + route.params.name);
</script>

<template>
  <EventCardsGrid :title="'Events for the category: ' + route.params.name" :apiPath="path" />
</template>
