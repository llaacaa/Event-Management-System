<template>
  <div class="dialog-backdrop" v-if="show">
    <div class="dialog">
      <h3>Enter your name</h3>
      <input
        v-model="name"
        type="text"
        placeholder="Your name"
        @keyup.enter="submit"
        autofocus
      />
      <div class="actions">
        <button @click="submit" :disabled="!name.trim()">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{
  (e: "save", name: string): void;
}>();

const name = ref(localStorage.getItem("username") || "");

function submit() {
  if (name.value.trim()) {
    localStorage.setItem("username", name.value.trim());
    emit("save", name.value.trim());
  }
}
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dialog {
  background-color: var(--color-background-soft);
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}
.actions {
  margin-top: 1rem;
  text-align: right;
}
input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1.2rem;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--color-background-mute);
}
button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>
