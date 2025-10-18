<script setup lang="ts">
import { ref } from 'vue'
import { useEpigramStore } from '../stores/epigrams'

const store = useEpigramStore()

const autoRotateSeconds = ref<number>(store.settings.autoRotateSeconds)
const ownSharePercent = ref<number>(store.settings.ownSharePercent)
const ownShareWindowMinutes = ref<number>(store.settings.ownShareWindowMinutes)
const maxHistoryCount = ref<number>(store.settings.maxHistoryCount)
const source = ref(store.settings.filters.source)
const types = ref(store.settings.filters.types.join(', '))
const fields = ref(store.settings.filters.fields.join(', '))
const categories = ref(store.settings.filters.categories.join(', '))

function save() {
  store.setAutoRotateSeconds(Number(autoRotateSeconds.value) || 0)
  store.setOwnShare(Number(ownSharePercent.value) || 0)
  store.setOwnShareWindowMinutes(Number(ownShareWindowMinutes.value) || 1)
  store.setMaxHistoryCount(Number(maxHistoryCount.value) || 0)
  const toList = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean)
  store.setFilters({
    source: source.value,
    types: toList(types.value),
    fields: toList(fields.value),
    categories: toList(categories.value)
  })
}

function resetFilters() {
  store.resetFilters()
  source.value = 'all'
  types.value = ''
  fields.value = ''
  categories.value = ''
}
</script>

<template>
  <div class="page">
    <h2>Rotation</h2>
    <div class="row">
      <label>Change epigram every (seconds)</label>
      <input type="number" v-model.number="autoRotateSeconds" min="0" />
    </div>

    <h2>Own epigrams share</h2>
    <div class="row">
      <label>Target share of own epigrams (%)</label>
      <input type="number" v-model.number="ownSharePercent" min="0" max="100" />
    </div>
    <div class="row">
      <label>Window (minutes)</label>
      <input type="number" v-model.number="ownShareWindowMinutes" min="1" />
    </div>
    <div class="hint">Current share in last {{ store.settings.ownShareWindowMinutes }} min: {{ store.recentOwnShare.toFixed(1) }}%</div>

    <h2>History</h2>
    <div class="row">
      <label>Max history quotes</label>
      <input type="number" v-model.number="maxHistoryCount" min="0" />
    </div>

    <h2>Filters</h2>
    <div class="row">
      <label>Source</label>
      <select v-model="source">
        <option value="all">All</option>
        <option value="system">System</option>
        <option value="user">User</option>
      </select>
    </div>
    <div class="row">
      <label>Types (comma-separated)</label>
      <input v-model="types" />
    </div>
    <div class="row">
      <label>Fields (comma-separated)</label>
      <input v-model="fields" />
    </div>
    <div class="row">
      <label>Categories (comma-separated)</label>
      <input v-model="categories" />
    </div>

    <div class="actions">
      <button @click="save">Save</button>
      <button class="outline" @click="resetFilters">Reset filters</button>
    </div>
  </div>
</template>

<style scoped>
.page{padding:16px;max-width:700px}
.row{display:flex;gap:12px;align-items:center;margin:8px 0}
.row label{width:260px}
.row input,.row select{flex:1;padding:8px;border:1px solid #e5e7eb;border-radius:8px}
.actions{display:flex;gap:8px;margin-top:12px}
.hint{color:#6b7280;font-size:0.9rem;margin-top:4px}
button{padding:8px 12px;border:1px solid #111827;border-radius:8px;background:#111827;color:#fff}
button.outline{background:#fff;color:#111827}
</style>
