<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { defineProps, ref } from "vue";

const props = defineProps<{
  comment: {
    id: number;
    authorName: string;
    createdAt: string;
    commentText: string;
    likes: number;
    dislikes: number;
    isLiked?: boolean;
    isDisliked?: boolean;
  };
}>();

const likeCount = ref(props.comment.likes);
const dislikeCount = ref(props.comment.dislikes);

const isLiked = ref(props.comment.isLiked ?? false);
const isDisliked = ref(props.comment.isDisliked ?? false);

const toggleLike = async () => {
  // If already liked, unlike
  if (isLiked.value) {
    likeCount.value--;
    isLiked.value = false;
    await sendBackEndRequest({
      method: "DELETE",
      path: `comments/${props.comment.id}/remove-reaction`,
    });
    return;
  }

  // If disliked, remove dislike first
  if (isDisliked.value) {
    isDisliked.value = false;
    dislikeCount.value--;
  }

  likeCount.value++;
  isLiked.value = true;

  await sendBackEndRequest({
    method: "POST",
    path: `comments/${props.comment.id}/like`,
  });
};

const toggleDislike = async () => {
  // If already disliked, undislike
  if (isDisliked.value) {
    dislikeCount.value--;
    isDisliked.value = false;
    await sendBackEndRequest({
      method: "DELETE",
      path: `comments/${props.comment.id}/remove-reaction`,
    });
    return;
  }

  // If liked, remove like first
  if (isLiked.value) {
    isLiked.value = false;
    likeCount.value--;
  }

  dislikeCount.value++;
  isDisliked.value = true;

  await sendBackEndRequest({
    method: "POST",
    path: `comments/${props.comment.id}/dislike`,
  });
};
</script>

<template>
  <div class="comment-header">
    <span class="username">{{ props.comment.authorName }}</span>
    <span class="date">{{ new Date(props.comment.createdAt).toLocaleString() }}</span>
  </div>
  <div class="comment-content">
    {{ props.comment.commentText }}
  </div>
  <div class="absolute right-5 top-12">
    <div class="flex">
      <div class="mx-1">
        <button @click="toggleLike">
          <v-icon
            icon="mdi-thumb-up"
            :color="isLiked ? 'blue' : 'gray'"
          ></v-icon>
        </button>
        <span class="pl-2">{{ likeCount }}</span>
      </div>
      <div class="mx-1">
        <button @click="toggleDislike">
          <v-icon
            icon="mdi-thumb-down"
            :color="isDisliked ? 'red' : 'gray'"
          ></v-icon>
        </button>
        <span class="pl-2">{{ dislikeCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-content {
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>