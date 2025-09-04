<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { useEventStore } from "@/stores/EventDetailState";
import type { EventCard } from "@/types/Events";
import { showToast } from "@/utils/Toast";
import { storeToRefs } from "pinia";

const emit = defineEmits(["save-edit"]);

const { editingEvent } = storeToRefs(useEventStore());

const formatDateForInput = (dateString: string) => {
  return dateString.slice(0, 10);
};

const handleSubmit = async () => {
  try {
    if (editingEvent.value) {
      const requestInfo: RequestInformation = {
        method: "PUT",
        path: `events/${editingEvent.value.id}`,
        data: {
          ...editingEvent.value,
          eventDate: new Date(editingEvent.value.eventDate).toISOString(),
        },
      };

      const response = await sendBackEndRequest(requestInfo);

      if (response.success) {
        showToast("Event updated successfully", "success");
        close();
      } else {
        showToast(
          response.data.error.message || "Failed to update event",
          "error"
        );
      }

      emit("save-edit");
    }
  } catch (error) {
    showToast("Error updating event", "error");
  }
};
const close = () => {
  useEventStore().setEditingEvent(null);
};
</script>

<template>
  <div class="modal-overlay" v-if="editingEvent as EventCard" @click="close">
    <div class="event-form" @click.stop>
      <div class="form-header">
        <h2>Edit Event</h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            v-model="(editingEvent as EventCard).title"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="(editingEvent as EventCard).description"
            required
          ></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="date">Event Date</label>
            <input
              type="date"
              id="date"
              :value="formatDateForInput((editingEvent as EventCard).eventDate)"
              @input="(e) => ((editingEvent as EventCard).eventDate = (e.target as HTMLInputElement).value)"
              required
            />
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input
              type="text"
              id="location"
              v-model="(editingEvent as EventCard).location"
              required
            />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="close">
            Cancel
          </button>
          <button type="submit" class="btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.event-form {
  background-color: var(--color-background-soft);
  padding: 2rem;
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  width: 100%;
  max-width: 600px;
  border: 1px solid var(--color-border);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.form-header h2 {
  margin: 0;
  color: var(--color-heading);
}

.close-button {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: var(--color-background-mute);
  color: var(--color-heading);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.btn-secondary:hover {
  background-color: var(--neutral-500);
}
</style>
