<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import type { Epigram } from "../types";

const props = defineProps<{ epigram: Epigram | null }>();

const top = ref(50);
const left = ref(50);
function randomize() {
  top.value = 15 + Math.random() * 70;
  left.value = 15 + Math.random() * 70;
}

// Typewriter effect for quote text
const displayedText = ref("");
let typingTimer: number | null = null;
const typingSpeedMs = 18;
function startTyping(fullText: string) {
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  displayedText.value = "";
  let i = 0;
  typingTimer = window.setInterval(() => {
    displayedText.value = fullText.slice(0, i);
    i++;
    if (i > fullText.length) {
      if (typingTimer) clearInterval(typingTimer);
      typingTimer = null;
    }
  }, typingSpeedMs);
}

watch(
  () => props.epigram?.id,
  () => {
    randomize();
    const text = props.epigram?.text ?? "";
    startTyping(text);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (typingTimer) clearInterval(typingTimer);
});
</script>

<template>
  <div class="random-wrap">
    <div
      v-if="epigram"
      class="epigram"
      :style="{ top: top + '%', left: left + '%' }"
    >
      <div class="text">“{{ displayedText }}”</div>
      <div class="meta">
        <span v-if="epigram.author">— {{ epigram.author }}</span>
        <span v-if="epigram.type"> · {{ epigram.type }}</span>
        <span v-if="epigram.field"> · {{ epigram.field }}</span>
      </div>
      <div class="actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.random-wrap {
  position: relative;
  /* Fit exactly into the visible area (viewport minus navbar and HomeView vertical paddings 12px top + 16px bottom = 28px) */
  height: calc(100vh - 56px - 28px);
  overflow: hidden;
}
.epigram {
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: min(80ch, 80vw);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.text {
  font-size: 1.2rem;
  line-height: 1.6;
}
.meta {
  margin-top: 8px;
  color: #6b7280;
  font-size: 0.9rem;
}
.actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.actions :deep(button) {
  padding: 6px 10px;
  border: 1px solid #111827;
  border-radius: 8px;
  background: #111827;
  color: #fff;
}
</style>
