<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { type RequestInformation, sendBackEndRequest } from "@/api/Requests.ts";
import NameDialog from "./NameDialog.vue";
import Comment from "./Comment.vue";

const props = defineProps<{
  eventId: number;
}>();

interface Comment {
  id: number;
  authorName: string;
  commentText: string;
  createdAt: string;
  eventId: number;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

const comments = ref<Comment[]>([]);
const newComment = ref("");
const isSubmitting = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const authorName = ref(localStorage.getItem("username") || "");
const showNameDialog = ref(false);

const sortedComments = computed(() => {
  return [...comments.value].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

onMounted(async () => {
  await fetchComments();
});

const fetchComments = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const requestInfo: RequestInformation = {
      method: "GET",
      path: `comments/${props.eventId}`,
    };

    const { success, data } = await sendBackEndRequest(requestInfo);

    if (success && data) {
      comments.value = data;
    } else {
      errorMessage.value = "Failed to load comments";
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    errorMessage.value = "An error occurred while loading comments";
  } finally {
    isLoading.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) {
    return;
  }

  if (!authorName.value.trim()) {
    showNameDialog.value = true;
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const requestInfo: RequestInformation = {
      method: "POST",
      path: `comments/${props.eventId}`,
      data: {
        content: newComment.value.trim(),
        authorName: authorName.value,
      },
    };

    const { success, data } = await sendBackEndRequest(requestInfo);

    if (success && data) {
      comments.value.push(data);
      newComment.value = "";
    } else {
      errorMessage.value = "Failed to post comment";
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    errorMessage.value = "An error occurred while posting your comment";
  } finally {
    isSubmitting.value = false;
  }
};

function handleNameSave(name: string) {
  authorName.value = name;
  showNameDialog.value = false;
}
</script>

<template>
  <div class="comment-section">
    <h2>Comments</h2>

    <NameDialog :show="showNameDialog" @save="handleNameSave" />

    <form @submit.prevent="submitComment" class="comment-form">
      <div class="form-group">
        <textarea
          v-model="newComment"
          placeholder="Leave a comment..."
          :disabled="isSubmitting"
          rows="3"
          class="comment-input"
        ></textarea>
      </div>
      <button
        type="submit"
        class="submit-button"
        :disabled="isSubmitting || !newComment.trim()"
      >
        {{ isSubmitting ? "Posting..." : "Post Comment" }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>

    <div class="comments-list">
      <div v-if="isLoading" class="loading-comments">Loading comments...</div>

      <div v-else-if="sortedComments.length === 0" class="no-comments">
        No comments yet. Be the first to comment!
      </div>

      <div v-else>
        <div
          v-for="comment in sortedComments"
          :key="comment.id"
          class="comment-item relative"
        >
          <Comment :comment="comment" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  margin-top: 1rem;
}

.comment-section h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 0.75rem;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--neutral-400);
  border-radius: 0.375rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  resize: vertical;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.submit-button:disabled {
  background-color: var(--neutral-500);
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.comments-list {
  margin-top: 1.5rem;
}

.loading-comments,
.no-comments {
  padding: 1rem;
  text-align: center;
  color: var(--neutral-600);
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.username {
  font-weight: 600;
  color: var(--primary-color);
}

.date {
  font-size: 0.875rem;
  color: var(--neutral-600);
}
</style>
