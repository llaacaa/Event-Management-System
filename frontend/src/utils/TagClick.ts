import { useTagStore } from "@/stores/SelectedTagState";
import type { Tag } from "@/types/Events";
import Router from "@/router";

export const handleTagClick = (tag: Tag) => {
  const tagStore = useTagStore();
  tagStore.setSelectedTag(tag);
  Router.push("/events-by-tag");
};
