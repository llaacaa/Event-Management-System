<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span>{{ isEditing ? "Edit Category" : "New Category" }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Category Name"
                  required
                  :rules="nameRules"
                  :disabled="isEditing"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.description"
                  label="Description"
                  required
                  :rules="descriptionRules"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions class="form-actions">
        <v-spacer></v-spacer>
        <v-btn 
          variant="outlined" 
          color="error" 
          @click="closeDialog"
          class="cancel-btn"
          size="large"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          color="primary"
          @click="saveCategory"
          :loading="isLoading"
          :disabled="!isFormChanged"
          class="save-btn"
          size="large"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive, computed } from "vue";

interface Props {
  modelValue: boolean;
  categoryName?: string | null;
  categoryDescription?: string | null;
}

interface FormData {
  name: string;
  description: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  categoryName: null,
  categoryDescription: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", data: FormData): void;
}>();

const dialog = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const formRef = ref<any>(null);
const originalData = ref<FormData>({ name: "", description: "" });

const formData = reactive<FormData>({
  name: "",
  description: "",
});

const isFormChanged = computed(() => {
  if (isEditing.value) {
    return formData.description !== originalData.value.description;
  }
  return formData.name !== "" && formData.description !== "";
});

const nameRules = [
  (v: string) => !!v || "Name is required",
  (v: string) =>
    (v && v.length <= 50) || "Name must be less than 50 characters",
];

const descriptionRules = [
  (v: string) => !!v || "Description is required",
  (v: string) =>
    (v && v.length <= 200) || "Description must be less than 200 characters",
];

watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
    if (newVal) {
      setupForm();
    }
  }
);

watch(
  [() => props.categoryName, () => props.categoryDescription],
  () => {
    if (dialog.value) {
      setupForm();
    }
  }
);

watch(dialog, (newVal) => {
  if (!newVal) {
    emit("update:modelValue", false);
    resetForm();
  }
});

const setupForm = () => {
  if (props.categoryName && props.categoryDescription) {
    isEditing.value = true;
    formData.name = props.categoryName;
    formData.description = props.categoryDescription;
    originalData.value = {
      name: props.categoryName,
      description: props.categoryDescription,
    };
  } else {
    isEditing.value = false;
    formData.name = "";
    formData.description = "";
    originalData.value = { name: "", description: "" };
  }
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const resetForm = () => {
  formData.name = "";
  formData.description = "";
  isEditing.value = false;
  originalData.value = { name: "", description: "" };
  if (formRef.value) {
    formRef.value.reset();
  }
};

const saveCategory = async () => {
  try {
    if (!formRef.value?.validate()) return;

    isLoading.value = true;

    emit("save", {
      name: formData.name,
      description: formData.description,
    });

    closeDialog();
  } catch (error) {
    console.error("Error saving category:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  setupForm();
});
</script>

<style scoped>
.form-actions {
  padding: 1.5rem;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.02);
}

.cancel-btn {
  min-width: 100px;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
}

.save-btn {
  min-width: 100px;
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
}

@media (prefers-color-scheme: dark) {
  .form-actions {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .cancel-btn:hover {
    box-shadow: 0 4px 8px rgba(248, 113, 113, 0.3);
  }
}
</style>