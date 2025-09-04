import { defineStore } from "pinia";
import type { EventCard } from "@/types/Events.ts";

export const useEventStore = defineStore("event", {
  state: () => ({
    selectedEvent: null as EventCard | null,
    editingEvent: null as EventCard | null,
  }),
  actions: {
    setSelectedEvent(event: EventCard) {
      this.selectedEvent = event;
    },
    setEditingEvent(event: EventCard | null) {
      this.editingEvent = event;
    },
  },
});
