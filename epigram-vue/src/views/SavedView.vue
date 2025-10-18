<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEpigramStore } from '../stores/epigrams'
import EpigramCard from '../components/EpigramCard.vue'
import type { Epigram } from '../types'

const store = useEpigramStore()

const savedMerged = computed(() => {
  const map = new Map(store.allEpigrams.map(e => [e.id, e]))
  return store.saved
    .map(s => {
      const e = map.get(s.id)
      if (!e) return null
      const categories = e.categories?.length ? e.categories : (s.categories ?? [])
      return { ...e, categories } as Epigram
    })
    .filter((x): x is Epigram => !!x)
})

const categories = computed(() => {
  const set = new Set<string>()
  savedMerged.value.forEach(e => (e.categories ?? []).forEach(c => set.add(c)))
  return Array.from(set).sort()
})

const selected = computed({
  get: () => store.settings.filters.categories,
  set: v => store.setFilters({ categories: v })
})

const filtered = computed(() => store.filterPool(savedMerged.value))

// Selection state
const selectedIds = ref<string[]>([])
const allIds = computed(() => filtered.value.map(e => e.id))
const allSelected = computed({
  get: () => allIds.value.length > 0 && selectedIds.value.length === allIds.value.length,
  set: (v: boolean) => {
    selectedIds.value = v ? [...allIds.value] : []
  }
})

function toggle(cat: string) {
  const s = new Set(selected.value)
  s.has(cat) ? s.delete(cat) : s.add(cat)
  selected.value = Array.from(s)
}

function reset() { store.resetFilters() }

async function deleteSelected() {
  if (selectedIds.value.length === 0) return
  const msg = selectedIds.value.length === 1 ? 'Delete selected epigram?' : `Delete ${selectedIds.value.length} selected epigrams?`
  if (!confirm(msg)) return
  await store.deleteSavedMany(selectedIds.value)
  selectedIds.value = []
}
</script>

<template>
  <div class="page">
    <div class="filters" v-if="categories.length">
      <div class="chips">
        <button v-for="c in categories" :key="c" :class="{active: selected.includes(c)}" @click="toggle(c)">{{ c }}</button>
      </div>
      <div class="actions">
        <button @click="reset">Reset filters</button>
        <label class="selectall" v-if="filtered.length">
          <input type="checkbox" v-model="allSelected" />
          <span>Select all</span>
        </label>
        <button :disabled="selectedIds.length === 0" class="danger" @click="deleteSelected">Delete</button>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="empty">No saved epigrams.</div>

    <div v-for="e in filtered" :key="e.id" class="saved-row">
      <input class="row-check" type="checkbox" :value="e.id" v-model="selectedIds" />
      <div class="saved-item">
        <EpigramCard :epigram="e" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page{padding:16px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}
.chips button{padding:6px 10px;border:1px solid #e5e7eb;border-radius:999px;background:#fff;color:#111827}
.chips button:hover{background:#f3f4f6;color:#111827;transform:none;box-shadow:none}
.chips button.active{border-color:#111827;background:#111827;color:#fff}
.chips button.active:hover{background:#0e1625}
.actions{display:flex;gap:8px;align-items:center;margin-bottom:12px}
.actions .selectall{display:flex;align-items:center;gap:6px;color:#374151}
.empty{color:#6b7280}
.saved-row{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;margin-bottom:10px}
.row-check{margin-top:10px;width:16px;height:16px}
.saved-item{display:flex;flex-direction:column}
button.danger{background:#dc2626;border-color:#dc2626;color:#fff}
</style>
