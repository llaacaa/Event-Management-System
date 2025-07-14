<template>
  <v-card
      :loading="loading"
      :title="title"
      :subtitle="subtitle"
      :text="text"
      :rounded="`lg`"
      class="card-custom"
      elevation="3"
      @click="onClick"
  >
    <v-card-text class="card-content">
      {{ text }}
    </v-card-text>
    <v-card-actions class="card-actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['cardClick']);

const onClick = () => {
  emit('cardClick');
};
</script>

<style scoped>
.card-custom {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-custom:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
}

.card-actions {
  padding: 16px;
}
</style>
