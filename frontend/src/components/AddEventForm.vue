<template>
  <div
    class="absolute flex w-screen h-screen bg z-500 bg-fixed top-0 left-0"
    @click="$emit('close')"
  >
    <div class="flex items-center justify-center w-full h-full z-600">
      <v-card
        class="mx-4 pa-6 cursor-default"
        max-width="500"
        width="100%"
        @click.stop
        :ripple="false"
      >
        <v-card-title class="text-h5 text-center mb-4">
          Create New Event
        </v-card-title>

        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <v-text-field
            v-model="form.title"
            label="Title"
            placeholder="Event title"
            variant="outlined"
            class="mb-3"
            :rules="[(v) => !!v || 'Title is required']"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Event description"
            variant="outlined"
            rows="3"
            class="mb-3"
          />

          <v-text-field
            v-model="form.eventDate"
            label="Event Date"
            type="date"
            variant="outlined"
            class="mb-3"
            :rules="[(v) => !!v || 'Event date is required']"
          />

          <v-text-field
            v-model="form.location"
            label="Location"
            placeholder="City or venue"
            variant="outlined"
            class="mb-3"
            prepend-inner-icon="mdi-map-marker"
          />

          <v-select
            v-model="form.category"
            label="Category"
            :items="categoryOptions"
            variant="outlined"
            class="mb-3"
          />

          <div class="mb-4">
            <v-text-field
              v-model="tagInput"
              label="Tags"
              placeholder="Enter tag and press Enter"
              variant="outlined"
              @keyup.enter.prevent="addTag"
              append-inner-icon="mdi-plus"
              @click:append-inner="addTag"
              class="mb-2"
            />

            <div class="d-flex flex-wrap gap-2" v-if="form.tags.length > 0">
              <v-chip
                v-for="tag in form.tags"
                :key="tag"
                closable
                @click:close="removeTag(tag)"
                color="primary"
                variant="tonal"
              >
                {{ tag }}
              </v-chip>
            </div>
          </div>

          <v-btn type="submit" color="success" block size="large" class="mt-4">
            Create Event
          </v-btn>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendBackEndRequest, type RequestInformation } from "@/api/Requests";
import { showToast } from "@/utils/Toast";
import { onMounted, reactive, ref } from "vue";

const formRef = ref();

const form = reactive({
  title: "",
  description: "",
  eventDate: "",
  location: "",
  category: "",
  tags: [] as string[],
});

const emit = defineEmits(["close", "save"]);

const fetchCategories = async () => {
  const requestInfo: RequestInformation = {
    method: "GET",
    path: "categories/",
  };

  const response = await sendBackEndRequest(requestInfo);

  if (response.success) {
    categoryOptions.value = response.data.map(
      (c: { name: string; description: string; createdAt: string }) => c.name
    );
  } else {
    showToast(
      response.data.error.message || "Failed to fetch categories.",
      "error"
    );
  }
};

onMounted(async () => {
  await fetchCategories();
});

const categoryOptions = ref(['']);

const tagInput = ref("");

const addTag = () => {
  if (tagInput.value.trim() && !form.tags.includes(tagInput.value.trim())) {
    form.tags.push(tagInput.value.trim());
    tagInput.value = "";
  }
};

const removeTag = (tag: string) => {
  form.tags = form.tags.filter((t) => t !== tag);
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    console.log("Form submitted:", { ...form });

    const requestInfo: RequestInformation = {
      method: "POST",
      path: "events/",
      data: { ...form },
    };

    const response = await sendBackEndRequest(requestInfo);

    if (response.success) {
      showToast("Event created successfully!", "success");
    } else {
      showToast(
        response.data.error.message || "Failed to create event.",
        "error"
      );
    }
    emit("save");
  }
};
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.bg {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
