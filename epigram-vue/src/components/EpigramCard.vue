<script setup lang="ts">
import type { Epigram } from '../types'

defineProps<{ epigram: Epigram }>()
</script>
<template>
  <div class="card">
    <div class="text">“{{ epigram.text }}”</div>
    <div class="meta">
      <span v-if="epigram.author">— {{ epigram.author }}</span>
      <span v-if="epigram.type"> · {{ epigram.type }}</span>
      <span v-if="epigram.field"> · {{ epigram.field }}</span>
      <span v-if="epigram.categories?.length"> · {{ epigram.categories.join(', ') }}</span>
    </div>
  </div>
</template>
<style scoped>
.card{border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;margin:8px 0;background:#fff}
.text{font-size:1rem;line-height:1.5}
.meta{color:#6b7280;font-size:0.85rem;margin-top:6px}
</style>
