import { defineStore } from 'pinia';
import type { EventCard } from "@/types/Events.ts";

export const useEventStore = defineStore('event', {
    state: () => ({
        selectedEvent: null as EventCard | null
    }),
    actions: {
        setSelectedEvent(event: EventCard) {
            this.selectedEvent = event;
        }
    }
});
