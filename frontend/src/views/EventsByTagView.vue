<script setup lang="ts">
import EventCardsGrid from "@/components/EventCardsGrid.vue";
import { useTagStore } from "@/stores/SelectedTagState";
import { ref } from "vue";

const selectedTag = ref(useTagStore().getSelectedTag());

</script>

<template>
  <EventCardsGrid
    v-if="selectedTag"
    :title="'Events for the tag: ' + selectedTag.name"
    :apiPath="'events/events-by-tag/' + selectedTag.id"
  />
  <div v-else>No tag selected</div>
</template>
