<script setup lang="ts">
import { ref, watch } from "vue";
import type { Epigram } from "../types";

const props = defineProps<{ modelValue?: Epigram | null }>();
const emit = defineEmits<{
  (
    e: "save",
    payload: { text: string; author?: string; type?: string; field?: string }
  ): void;
  (e: "update:modelValue", value: Epigram | null): void;
}>();

const text = ref("");
const author = ref("");
const type = ref("");
const field = ref("");

watch(
  () => props.modelValue,
  (v) => {
    text.value = v?.text ?? "";
    author.value = v?.author ?? "";
    type.value = v?.type ?? "";
    field.value = v?.field ?? "";
  },
  { immediate: true }
);

function onSubmit() {
  if (!text.value.trim()) return;
  emit("save", {
    text: text.value.trim(),
    author: author.value || undefined,
    type: type.value || undefined,
    field: field.value || undefined,
  });
  emit("update:modelValue", null);
  text.value = "";
  author.value = "";
  type.value = "";
  field.value = "";
}
</script>

<template>
  <form class="editor" @submit.prevent="onSubmit">
    <textarea v-model="text" placeholder="Epigram text"></textarea>
    <div class="row">
      <input v-model="author" placeholder="Author (optional)" />
      <input v-model="type" placeholder="Type (e.g., quote, aphorism)" />
      <input v-model="field" placeholder="Field (e.g., philosophy, tech)" />
    </div>
    <div class="actions">
      <button type="submit">Save</button>
    </div>
  </form>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}
textarea {
  min-height: 80px;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.row {
  display: flex;
  gap: 8px;
}
.row input {
  flex: 1;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
button {
  padding: 8px 12px;
  border: 1px solid #111827;
  border-radius: 8px;
  background: #111827;
  color: #fff;
}
</style>
