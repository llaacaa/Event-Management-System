import type { Tag } from "@/types/Events";
import { defineStore } from "pinia";

export const useTagStore = defineStore("tag", {
  state: () => ({
    selectedTag: null as Tag | null,
  }),
  actions: {
    setSelectedTag(tag: Tag) {
      this.selectedTag = tag;
      localStorage.setItem("selectedTag", JSON.stringify(tag));
    },
    getSelectedTag() {
      if (!this.selectedTag) {
        const storedTag = localStorage.getItem("selectedTag");
        if (storedTag) {
          this.selectedTag = JSON.parse(storedTag);
        }
      }
      return this.selectedTag;
    },
  },
});
